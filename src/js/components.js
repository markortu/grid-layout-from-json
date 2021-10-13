function resizeCanvas(mWidth, mHeight) {
    let canvas = document.getElementById('canvas');
    canvas.width = mWidth;
    canvas.height = mHeight;
    var json = editor.getSession().getValue();
    app(mWidth, mHeight, JSON.parse(json));
}

function clearCanvas() {
    let canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function layoutSizeChooser() {
    var widthInput = document.getElementById("width-input");
    var heightInput = document.getElementById("height-input");

    widthInput.onchange = function() { resizeCanvas(widthInput.value, heightInput.value) };
    heightInput.onchange = function() { resizeCanvas(widthInput.value, heightInput.value) };
}

function createEditor(json) {
    const container = document.getElementById("editor")
    var editor = ace.edit(container, {
        mode: "ace/mode/json",
        selectionStyle: "text"
    })
    var opt = {
        indent_size: 2
    };
    editor.setTheme("ace/theme/monokai");
    editor.session.setValue(JSON.stringify(json, null, 2));
    editor.setOptions({
        fontSize: "12pt",
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
    });
    editor.renderer.updateFontSize()
    editor.getSession().on('change', function() {
        clearCanvas()
        let canvas = document.getElementById('canvas');
        var json = editor.getSession().getValue();
        try {
            app(canvas.width, canvas.height, JSON.parse(json));
        } catch (e) {
            return;
        }

    });

    window.editor = editor;
}