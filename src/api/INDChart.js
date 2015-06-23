/**
 * @file ND Chart Interface
 * @author HPCC Systems
 */

"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../common/Palette"], factory);
    } else {
        root.api_INDChart = factory(root.common_Palette);
    }
}(this, function (Palette) {
    /**
     * @interface api_INDChart
     * @class api_INDChart
     */
    function INDChart() {
    }
    /**
     * Instance of a HPCC VIZ Palette object.
     * @member {Object} _palette
     * @memberof api_INDChart
     * @private
     */
    INDChart.prototype._palette = Palette.ordinal("default");

    /**
     * Populates Data and Columns with test data.
     * @method testData
     * @memberof api_INDChart
     * @instance
     * @returns {Widget}
     */
    INDChart.prototype.testData = function () {
        switch (this._chartType) {
            case 'ScatterChart':
                this.columns(["ID", "Year 1", "Year 2", "Year 3"]);
                this.data([
                    [10, 75, 68, 65],
                    [20, 45, 55, 52],
                    [30, 98, 92, 90],
                    [40, 66, 60, 86]
                ]);
                break;

            default:
                this.columns(["Subject", "Year 1", "Year 2", "Year 3"]);
                this.data([
                    ["Geography", 75, 68, 65],
                    ["English", 45, 55, 52],
                    ["Math", 98, 92, 90],
                    ["Science", 66, 60, 66]
                ]);
                break;
        }

        return this;
    };

    //  Events  ---
    /**
     * @method Overridable click callback function.
     * @memberof api_INDChart
     * @param {type} row
     * @param {type} column
     * @returns {undefined}
     */
    INDChart.prototype.click = function (row, column) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column);
    };

    return INDChart;
}));
