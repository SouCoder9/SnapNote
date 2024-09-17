document.addEventListener('DOMContentLoaded', () => {
    const canvas = new fabric.Canvas('canvas');
    const colorPicker = document.getElementById('colorPicker');
    const colorPaletteBtn = document.getElementById('colorPaletteBtn');
    const shapesBtn = document.getElementById('shapesBtn');
    const shapesMenu = document.getElementById('shapesMenu');
    let selectedColor = '#000000';
    let fontSize = 20;

    // Set canvas background color to match eraser color
    canvas.setBackgroundColor('#333', canvas.renderAll.bind(canvas));

    // Handle color picker visibility
    colorPaletteBtn.addEventListener('click', () => {
        colorPicker.click();
    });

    // Update selected color when the color picker value changes
    colorPicker.addEventListener('change', (e) => {
        selectedColor = e.target.value;
    });

    // Toggle Shapes Menu Visibility
    shapesBtn.addEventListener('click', () => {
        shapesMenu.style.display = shapesMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Free Draw Button
    document.getElementById('freeDrawBtn').addEventListener('click', () => {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
            canvas.freeDrawingBrush.color = selectedColor;
            canvas.freeDrawingBrush.width = 5;
        }
    });

    // Add Text Function
    function addText() {
        const color = document.getElementById('colorPicker').value;
        const text = new fabric.Textbox('', {
            left: 25, 
            top: 25,
            fill: color,
            fontSize: fontSize,
            fontFamily: 'Hell0',
            editable: true,
            width: canvas.width - 20, 
            textAlign: 'left', 
            splitByGrapheme: true 
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
    }

    // Add Text Button
    document.getElementById('addTextBtn').addEventListener('click', () => {
        addText();
    });

    // Increase Font Size Button
    document.getElementById('increaseFontSizeBtn').addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            fontSize += 2;
            activeObject.set('fontSize', fontSize);
            canvas.renderAll();
        }
    });

    // Decrease Font Size Button
    document.getElementById('decreaseFontSizeBtn').addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'textbox') {
            fontSize = Math.max(2, fontSize - 2); // Prevent font size from going below 2
            activeObject.set('fontSize', fontSize);
            canvas.renderAll();
        }
    });

    // Add Shape Buttons
    function addShape(type) {
        let shape;
        switch (type) {
            case 'rectangle':
                shape = new fabric.Rect({
                    left: 100,
                    top: 100,
                    fill: 'transparent',
                    stroke: selectedColor,
                    width: 100,
                    height: 100
                });
                break;
            case 'circle':
                shape = new fabric.Circle({
                    left: 100,
                    top: 100,
                    fill: 'transparent',
                    stroke: selectedColor,
                    radius: 50
                });
                break;
            case 'triangle':
                shape = new fabric.Triangle({
                    left: 100,
                    top: 100,
                    fill: 'transparent',
                    stroke: selectedColor,
                    width: 100,
                    height: 100
                });
                break;
            case 'hexagon':
                shape = new fabric.Polygon([
                    { x: 0, y: 50 },
                    { x: 25, y: 0 },
                    { x: 75, y: 0 },
                    { x: 100, y: 50 },
                    { x: 75, y: 100 },
                    { x: 25, y: 100 }
                ], {
                    left: 100,
                    top: 100,
                    fill: 'transparent',
                    stroke: selectedColor
                });
                break;
            case 'ellipse':
                shape = new fabric.Ellipse({
                    left: 100,
                    top: 100,
                    fill: 'transparent',
                    stroke: selectedColor,
                    rx: 50,
                    ry: 30
                });
                break;
        }
        canvas.add(shape);
        shapesMenu.style.display = 'none'; 
    }

    document.getElementById('shapesMenu').querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            addShape(button.textContent.toLowerCase());
        });
    });

    // Eraser Function (Match eraser color to canvas background)
    function enableEraser() {
        if (canvas.isDrawingMode) {
            canvas.isDrawingMode = false;
            canvas.renderAll();
        }

        const eraserBrush = new fabric.PencilBrush(canvas);
        eraserBrush.color = '#333'; // Ensure eraser matches canvas background color
        eraserBrush.width = 20;
        canvas.freeDrawingBrush = eraserBrush;
        canvas.isDrawingMode = true;
    }

    // Activate eraser on button click
    document.getElementById('eraserBtn').addEventListener('click', enableEraser);

    // Fill Color Button
    document.getElementById('fillColorBtn').addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('fill', selectedColor);
            canvas.renderAll();
        }
    });

    // Delete Selected Button
    document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
    });

    // Delete All Button
    document.getElementById('deleteAllBtn').addEventListener('click', () => {
        // Remove all objects from the canvas, but keep the background color
        canvas.getObjects().forEach(obj => {
            canvas.remove(obj);
        });
        canvas.renderAll(); // Re-render the canvas
    });
    
    // Save Button
    document.getElementById('saveBtn').addEventListener('click', () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempContext = tempCanvas.getContext('2d');
        tempContext.fillStyle = '#333'; // Use same background color as the canvas
        tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        const canvasDataURL = canvas.toDataURL();
        const img = new Image();
        img.src = canvasDataURL;

        img.onload = () => {
            tempContext.drawImage(img, 0, 0);
            const finalDataURL = tempCanvas.toDataURL('image/jpeg');
            const link = document.createElement('a');
            link.href = finalDataURL;
            link.download = 'Snap.jpg';
            link.click();
        };
    });
});
