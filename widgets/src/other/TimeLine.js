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
    var timelineLoaded = false;
    require(["lib/timeline/d3-timeline"], function (d3TimeLine) {
        timelineLoaded = true;
    });
    function TimeLine() {
        SVGWidget.call(this);
        ITimeLine.call(this);
        this._class = "other_Timeline";

    };
    TimeLine.prototype = Object.create(SVGWidget.prototype);
    TimeLine.prototype.implements(ITimeLine.prototype);

    TimeLine.prototype.publish("paletteID", "Dark2", "set", "Palette ID", TimeLine.prototype._palette.switch());

    TimeLine.prototype.enter = function (domNode, element) {
        this.svg = element.append("g");	
    };

    TimeLine.prototype.update = function (domNode, element) {
        var context = this;
 	    
        this._palette = this._palette.switch(this._paletteID);

        this.chart = d3.timeline()
            .colors( this._palette )
            .colorProperty('fruit')
            .click(function (d, i, datum) {
                //alert(datum.label);
                alert("Clicked: ");
            })
        ;
        this.svg.attr("width", this.width())
        .datum(this._data).call(this.chart);


    };

    return TimeLine;
}));
