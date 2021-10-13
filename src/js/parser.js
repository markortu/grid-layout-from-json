/*
Created by Marc
Date: 12/10/2021
*/

class Region {
    //A region consists of a rectangular area defined by the left, top, right and bottom.
    constructor(ctx, L, T, R, B) {
        this.ctx = ctx;
        this.L = L;
        this.T = T;
        this.R = R;
        this.B = B;
    }
    W() {
        return this.R - this.L;
    }
    H() {
        return this.B - this.T;
    }
    CreateGrid(cellIdx, nRows, nColumns) {
        var cellWidth = this.W() / nColumns;
        var cellHeight = this.H() / nRows;
        var cell = 0;

        for (var row = 0; row < nRows; row++) {
            for (var col = 0; col < nColumns; col++) {
                if (cell == cellIdx) {
                    return new Region(this.ctx, this.L + col * cellWidth, this.T + row * cellHeight, this.L + (col + 1) * cellWidth, this.T + (row + 1) * cellHeight);
                }
                cell++;
            }
        }
    }
    PrintRegion(label) {
        console.info(label + ":");
        var table = {};
        table.left = this.L;
        table.top = this.T;
        table.right = this.R;
        table.bottom = this.B;
        console.table(table);
    }
}

function ParseLayout(jsonObjects, region) {

    var parentRegion = region;
    var nchildren = jsonObjects.length;

    var pageCounter = 0;

    var customGridSize = 0;
    var customSize = false;
    /**
     * In this first loop we iterate over the children to check if a custom size is specified
     * and compute the custom grid size.
     * TOTAL_CELLS = siblingSize1 + siblingSize2 + siblingSize3;
     * In this way we solve the problem to have a fixed grid size (e.g. 12 as Boostrap)
     */
    for (let i = 0; i < nchildren; i++) {
        const object = jsonObjects[i];

        if (object.size) {
            customGridSize += parseInt(object.size);
        } else {
            customGridSize++; // If the size of the container is not specified, we add 1 as the default value.
        }
    }
    //Finally we check if customGridSize is higher than nchildren, if so, will mean that the grid has a custom size specified.
    //We'll use this flag later, to check if the object has custom size even if it is not specified.
    customSize = customGridSize > nchildren ? true : false;
    var widthSlice = parentRegion.W() / customGridSize;
    var heightSlice = parentRegion.H() / customGridSize;
    var offset = 0;

    /**
     * In this second loop we iterate over the children to construct the grid regions based on
     * the containers specified in the JSON.
     * Each object can have the following fields:
     * - container: Defining the type of the object (Row, Column or Page).
     * - name: Specifies the name of the container/object.
     * - size: Specifies a custom size for the Row/Column containers.
     * - children: Children objects of the container.
     * - parameter : Specifies the ID of a parameter in container (Row,Column).
     * - border: Specifies the border color of the region, if not specified, there is no border.
     */
    for (let i = 0; i < nchildren; i++) {
        const object = jsonObjects[i];

        //The "container" field is mandatory, if not specified, nothing is performed.
        if (object.container) {
            var container = object.container;
            switch (container) {
                case "Row":
                    if (customSize) {
                        object.size = object.size != undefined ? object.size : 1; //set 1 if size not specified
                        region = new Region(parentRegion.ctx, parentRegion.L, parentRegion.T + heightSlice * offset, parentRegion.R, parentRegion.T + heightSlice * (offset + parseInt(object.size)));
                        offset += parseInt(object.size);
                    } else {
                        region = parentRegion.CreateGrid(i, nchildren, 1);
                    }
                    break;
                case "Column":
                    if (customSize) {
                        object.size = object.size != undefined ? object.size : 1; //set 1 if size not specified
                        region = new Region(parentRegion.ctx, widthSlice * offset, parentRegion.T, widthSlice * (offset + parseInt(object.size)), parentRegion.B);
                        offset += parseInt(object.size);
                    } else {
                        region = parentRegion.CreateGrid(i, 1, nchildren);
                    }
                    break;
                case "Page":
                    //console.log("Page " + pageCounter++);
                    break;
                default:
                    break;
            }
            if (object.parameter) {
                var parameter = object.parameter;
                //Parameter ID mandatory!
                if (parameter.ref) {
                    var label = parameter.label != undefined ? parameter.label : parameter.ref;
                    DrawElement(region, label);
                } else {
                    console.log("Reference is mandatory!")
                }
            }
            if (object.name) {
                //TODO: do something with the name field...
                //console.log("Region name: " + object.name)
            }
            if (object.border) {
                var color = object.border;
                DrawRectangle(region, color);
            }
        }

        //For each object we recursively call the parse function, if it has no children, we are at the end of the tree.
        if (object.children) {
            ParseLayout(object.children, region);
        }
    }
}