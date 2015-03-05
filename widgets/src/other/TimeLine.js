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

    TimeLine.prototype.enter = function (domNode, element) {
        this.svg = element.append("g");	
    };

    TimeLine.prototype.update = function (domNode, element) {
        var context = this;
 	    
        this.chart = d3.timeline()
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
