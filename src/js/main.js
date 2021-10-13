function app(width, height, json) {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var region = new Region(ctx, 0, 0, parseInt(width), parseInt(height));
    ParseLayout(json, region);
}

function init() {
    fetch("src/data.json")
        .then(response => response.json())
        .then(json => {
            createEditor(json);
            var widthInput = document.getElementById("width-input");
            var heightInput = document.getElementById("height-input");
            resizeCanvas(widthInput.value, heightInput.value);
            layoutSizeChooser();
        });
}

init();