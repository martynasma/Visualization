/**
* @file Slider Interface
* @author HPCC Systems
*/

"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.other_ISlider = factory();
    }
}(this, function () {
    /**
     * @interface form_ISlider
     * @class form_ISlider
     */
    function ISlider() {
    }

    /**
     * Range of slider. Object with the properties: "low" and "high".
     * @member {Object} _range
     * @memberof form_ISlider
     * @private
     */
    ISlider.prototype._range = { low: 0, high: 100 };
    /**
     * Step value of slider.
     * @member {Number} _step
     * @memberof form_ISlider
     * @private
     */
    ISlider.prototype._step = 1;
    /**
     * Enables/Disables range on slider.
     * @member {Boolean} _allowRange
     * @memberof form_ISlider
     * @private
     */
    ISlider.prototype._allowRange = false;   //  TODO:  range selections is not supported yet  ---

    /**
     * Overridable click callback function.
     * @method click
     * @memberof form_ISlider
     * @param {type} value
     */
    ISlider.prototype.click = function (value) {
        console.log("click:  " + value);
    };
    /**
     * Slider selection event callback function.
     * @method click
     * @memberof common_IList
     * @param {type} value First value range of slider.
     * @param {type} value2 Second value range of slider.
     */
    ISlider.prototype.newSelection = function (value, value2) {
        console.log("newSelection:  " + value + ", " + value2);
    };
    return ISlider;
}));
