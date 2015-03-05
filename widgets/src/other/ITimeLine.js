"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../common/Palette"], factory);
    } else {
        root.ITimeLine = factory(root.Palette);
    }
}(this, function (Palette) {
    function ITimeLine() {
    };

    ITimeLine.prototype._palette = Palette.ordinal("default");

    ITimeLine.prototype.testData = function () {
        /*
        var testData = [
            {times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
            {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]},
        ];
        */
        var testDataWithColor = [
            {label: "fruit 1", fruit: "orange", times: [
              {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
            {label: "fruit 2", fruit: "apple", times: [
              {"starting_time": 1355752800000, "ending_time": 1355759900000},
              {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {label: "fruit3", fruit: "lemon", times: [
              {"starting_time": 1355761910000, "ending_time": 1355763910000}]},
        ];
        //this.data(testData);
        this.data(testDataWithColor);
        return this;
    };

    //  Properties  ---

    //  Events  ---
    ITimeLine.prototype.click = function (d) {
        console.log("Click:  " + d.label);
    };

    return ITimeLine;
}));
