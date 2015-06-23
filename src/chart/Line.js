"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "./Scatter"], factory);
    } else {
        root.chart_Line = factory(root.d3, root.chart_Scatter);
    }
}(this, function (d3, Scatter) {
    /**
     * @class chart_Line
     * @extends chart_Scatter
     * @extends api_INDChart
     * @implements api_INDChart
     */
    function Line(target) {
        Scatter.call(this);

        this.interpolate("linear");
    }
    Line.prototype = Object.create(Scatter.prototype);
    /**
     * Specifies the class name of the container.
     * @member {string} _class
     * @memberof chart_Line
     * @private
     */
    Line.prototype._class += " chart_Line";

    return Line;
}));