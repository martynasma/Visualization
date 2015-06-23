/**
 * @file Transition Object
 * @author HPCC Systems
 */

"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.common_Transition = factory();
    }
}(this, function () {
    /**
     * @class common_Transition
     */
    function Transition(widget) {
        this._widget = widget;
        this._duration = 250;
        this._delay = 0;
        this._ease = "cubic-in-out";
    }

    Transition.prototype.duration = function (_) {
        if (!arguments.length) return this._duration;
        this._duration = _;
        return this._widget;
    };

    Transition.prototype.delay = function (_) {
        if (!arguments.length) return this._delay;
        this._delay = _;
        return this._widget;
    };

    Transition.prototype.ease = function (_) {
        if (!arguments.length) return this._ease;
        this._ease = _;
        return this._widget;
    };

    /**
     * TODO
     * @method update
     * @memberof common_Shape
     * @instance
     * @protected
     * @param {HTMLElement} domeNode HTML/SVG DOMNode of widget container.
     * @param {D3Selection} element d3 selection object of widget.
     */
    Transition.prototype.apply = function (selection) {
        if (this._duration || this._delay) {
            return selection.transition()
                .duration(this._duration)
                .delay(this._delay)
                .ease(this._ease)
            ;
        }
        return selection;
    };

    return Transition;
}));
