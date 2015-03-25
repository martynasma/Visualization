/*
https://github.com/jiahuang/d3-timeline
*/
"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../common/SVGWidget", "./ITimeLine", "d3/d3", "css!./TimeLine"], factory);
    } else {
        root.Entity = factory(root.SVGWidget, root.ITimeLine, root.d3);
    }
}(this, function (SVGWidget, ITimeLine, d3) {

    function TimeLine() {
        SVGWidget.call(this);
        ITimeLine.call(this);
        this._class = "other_Timeline";

        this._drawStartPos = "top-left"; // override default svg draw position
    };
    TimeLine.prototype = Object.create(SVGWidget.prototype);
    TimeLine.prototype.implements(ITimeLine.prototype);

    TimeLine.prototype.publish("paletteID", "Dark2", "set", "Palette ID", TimeLine.prototype._palette.switch());
    TimeLine.prototype.publish("margin", "", "object", "margin object");
    //TimeLine.prototype.publish("colorProperty", "fruit", "string", "color property"); // DO WE EVEN NEED THIS???

    TimeLine.prototype.enter = function (domNode, element) {
        this.svg = element.append("g");	
    };

    TimeLine.prototype.update = function (domNode, element) {
        var context = this;
 	    
        this._palette = this._palette.switch(this._paletteID);

        this.chart = d3.timeline()
            //.stack() // toggles graph stacking
            .margin({left:70, right:30, top:0, bottom:0})
            .colors( this._palette )
            //.colorProperty(this.colorProperty()) ???? dont need??
            .click(function (d, i, datum) {
               alert('Clicked '+datum.label) //TODO get working
            })

        ;
        this.svg.attr("width", this.width()).attr("height","200")
        .datum(this._data).call(this.chart);


    };

    TimeLine.prototype.render = function (callback) {
        var context = this;
        require(["lib/timeline/d3-timeline"], function (d3TimeLine) {
            SVGWidget.prototype.render.call(context, callback);
        });
        return this;
    };


    return TimeLine;
}));
