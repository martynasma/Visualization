/**
 * @file HPCC VIZ MultiChartSurface
 * @author HPCC Systems
 */

"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/ResizeSurface", "./MultiChart", "../api/INDChart"], factory);
    } else {
        root.chart_MultiChartSurface = factory(root.d3, root.common_ResizeSurface, root.chart_MultiChart, root.api_INDChart);
    }
}(this, function (d3, ResizeSurface, MultiChart, INDChart) {
    /**
     * @class chart_MultiChartSurface
     * @extends common_ResizeSurface
     * @extends api_INDChart
     * @implements api_INDChart
     */
    function MultiChartSurface() {
        ResizeSurface.call(this);
        INDChart.call(this);

        this._title = "MultiChartSurface";
        this._content = new MultiChart();
        this._content.click = function (row, column) {
            context.click(row, column);
        };

        var context = this;
        this._menu.click = function (d) {
            context._content.chartType(d).render();
        };
        this.mode("all");
    }
    MultiChartSurface.prototype = Object.create(ResizeSurface.prototype);
    MultiChartSurface.prototype.implements(INDChart.prototype);
    /**
     * Specifies the class name of the container.
     * @member {string} _class
     * @memberof chart_MultiChartSurface
     * @private
     */
    MultiChartSurface.prototype._class += " chart_MultiChartSurface";
    MultiChartSurface.prototype.testData = INDChart.prototype.testData;

    MultiChartSurface.prototype.publishProxy("chartType", "_content");

    /**
     * Sets the columns for the data being passed into the encapsulated widget via .data() method.
     * @method columns
     * @memberof chart_MultiChartSurface
     * @instance
     * @param {String[]} _ An array of strings representing the column names for data passed to widget.
     * @returns {Widget}
     * @example widget.columns(["ID", "Year 1", "Year 2"]).data([ [40, 66, 60], [30, 98, 92]  ]).render();
     */
    MultiChartSurface.prototype.columns = function (_) {
        if (!arguments.length) return this._content.columns();
        this._content.columns(_);
        return this;
    };

    /**
     * Sets data to be render within the encapsulated widget.
     * @method data
     * @memberof chart_MultiChartSurface
     * @instance
     * @param {Mixed} _ The data being rendered.
     * @returns {Widget}
     * @example widget.columns(["ID", "Year 1", "Year 2"]).data([ [40, 66, 60], [30, 98, 92]  ]).render();
     */
    MultiChartSurface.prototype.data = function (_) {
        if (!arguments.length) return this._content.data();
        this._content.data(_);
        return this;
    };

    /**
     * Sets the mode of the MultiChartSurface Menu. This filters the list of widgets that can be selected/rendered in the MultiChartSurface. Available options are "2d", "multi", and "all".
     * @method data
     * @memberof chart_MultiChartSurface
     * @instance
     * @param {Mixed} _ The mode to set.
     * @returns {Widget}
     * @example widget.columns(["ID", "Year 1", "Year 2"]).data([ [40, 66, 60], [30, 98, 92]  ]).render();
     */
    MultiChartSurface.prototype.mode = function (_) {
        if (!arguments.length) return this._mode;
        this._mode = _;
        switch (this._mode) {
            case "2d":
                this.menu(this._content._2dChartTypes.concat(this._content._anyChartTypes).map(function (item) { return item.display; }).sort());
                break;
            case "multi":
                this.menu(this._content._multiChartTypes.concat(this._content._anyChartTypes).map(function (item) { return item.display; }).sort());
                break;
            case "all":
                /* falls through */
            default:
                this.menu(this._content._allChartTypes.map(function (item) { return item.display; }).sort());
        }
        return this;
    };

    return MultiChartSurface;
}));
