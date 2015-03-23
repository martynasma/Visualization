"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../common/Palette"], factory);
    } else {
        root.IDygraph = factory(root.Palette);
    }
}(this, function (Palette) {
    function IDygraph() {
    };
    IDygraph.prototype._paletteX = Palette.ordinal("default");

    //  Data ---
    IDygraph.prototype.testDataX = function () {
        this.columns(["Subject", "Year 1", "Year 2", "Year 3"]);
        this.data([
            ["Geography", 75, 68, 65],
            ["English", 45, 55, 52],
            ["Math", 98, 92, 90],
            ["Science", 66, 60, 66]
        ]);
        return this;
    };

    //IDygraphEvents  ---
    IDygraph.prototype.clickX = function (row, column) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column);
    };

    console.log(this);

    IDygraph.prototype.xaxis = {
        'publish': dyChart.prototype.publish
    };

    IDygraph.prototype.yaxis = {
        'publish': dyChart.prototype.publish
    };

    return IDygraph;
}));
