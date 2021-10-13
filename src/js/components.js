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

function DrawRectangle(region, color) {
    region.ctx.beginPath();
    region.ctx.lineWidth = 3;
    region.ctx.strokeStyle = color;
    region.ctx.rect(region.L, region.T, region.W(), region.H());
    region.ctx.stroke();
}

function DrawElement(region, ID) {
    region.ctx.beginPath();
    region.ctx.fillStyle = "#837f7f";
    region.ctx.arc((region.L + region.R) / 2, (region.T + region.B) / 2, 30, 0, 2 * Math.PI, false);
    region.ctx.fill();
    region.ctx.beginPath();
    region.ctx.fillStyle = "#686868";
    region.ctx.arc((region.L + region.R) / 2, (region.T + region.B) / 2, 20, 0, 2 * Math.PI, false);
    region.ctx.fill();
    region.ctx.beginPath();
    region.ctx.font = "bold 15px Arial";
    region.ctx.textAlign = "center";
    region.ctx.fillStyle = "black";
    region.ctx.fillText(ID, (region.L + region.R) / 2, 60 + (region.T + region.B) / 2, region.W());
    region.ctx.fill();
}