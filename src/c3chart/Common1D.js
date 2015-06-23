/**
 * @file c3 Chart Common1D
 * @author HPCC Systems
 */

"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["./Common", "../api/I1DChart"], factory);
    } else {
        root.c3chart_Common1D = factory(root.c3chart_Common, root.api_I1DChart);
    }
}(this, function (Common, I1DChart) {
    /**
     * @class c3chart_Common1D
     * @abstract
     * @extends c3chart_Common
     * @extends api_I1DChart
     * @implements api_I1DChart
     * @noinit
     */
    function Common1D(target) {
        Common.call(this);
        I1DChart.call(this);

        var context = this;
        this._config.color = {
            pattern: this._palette.colors()
        };

        this._config.data.onclick = function (d, element) {
            context.click(context.rowToObj(context._data[d.i1Dex]), d.id);
        };
        this._config.data.color = function (color, d) {
            return context._palette(d.id ? d.id : d);
        };
    }
    Common1D.prototype = Object.create(Common.prototype);
    Common1D.prototype.implements(I1DChart.prototype);
    /**
     * Specifies the class name of the container.
     * @member {string} _class
     * @memberof c3chart_Common1D
     * @private
     */
    Common1D.prototype._class += " c3chart_Common1D";

    Common1D.prototype.publish("paletteID", "default", "set", "Palette ID", Common1D.prototype._palette.switch(), {tags:['Basic','Shared']});

    /**
     * The function that is called when this widget "enters" the web page. after enter() and everytime the widget is updated with subsequent render calls.
     * @method update
     * @memberof c3chart_Common1D
     * @instance
     * @protected
     * @param {HTMLElement} domeNode HTML DOMNode of widget container.
     * @param {D3Selection} element d3 selection object of widget.
     */
    Common1D.prototype.update = function (domNode, element) {
        this._palette = this._palette.switch(this.paletteID());
        Common.prototype.update.apply(this, arguments);
    };

    return Common1D;
}));
