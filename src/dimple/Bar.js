"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "./Common", "../api/INDChart"], factory);
    } else {
        root.dimple_Bar = factory(root.d3, root.dimple_Common, root.api_INDChart);
    }
}(this, function (d3, Common, INDChart) {

    function Bar() {
        Common.call(this);

        this._chartType = "BarChart";
    }
    Bar.prototype = Object.create(Common.prototype);
    Bar.prototype.implements(INDChart.prototype);
    Bar.prototype._class += " dimple_Bar";

    /**
     * Publish Params Common To Other Libraries
     */
    Bar.prototype.publish("isStacked", false, "boolean", "Stacks the elements in a series",null,{tags:['Basic','Shared']});
    //opacity?
    Bar.prototype.publish("axisFontSize", null, "number", "X/Y Axis Label Font Size",null,{tags:['Basic','Shared']});
    Bar.prototype.publish("axisFontFamily", null, "string", "X/Y Axis Label Font Name",null,{tags:['Basic','Shared']});

    Bar.prototype.publish("xAxisFontColor", null, "html-color", "X Axis Text Font Color",null,{tags:['Basic','Shared']});
    Bar.prototype.publish("yAxisFontColor", null, "html-color", "X Axis Text Font Color",null,{tags:['Basic','Shared']});

    Bar.prototype.publish("xAxisBaselineColor", null, "html-color", "Specifies The Color of The Baseline For The Horizontal Axis",null,{tags:['Intermediate','Shared']});
    Bar.prototype.publish("yAxisBaselineColor", null, "html-color", "Specifies The Color of The Baseline For The Vertical Axis",null,{tags:['Intermediate','Shared']});

    Bar.prototype.publish("xAxisTitle", "", "string", "X Axis Title",null,{tags:['Basic','Shared']});
    Bar.prototype.publish("yAxisTitle", "", "string", "Y Axis Title",null,{tags:['Basic','Shared']});

    Bar.prototype.publish("xAxisTitleFontColor", null, "html-color", "Horizontal Axis Title Text Style (Color)",null,{tags:['Intermediate','Shared']});
    Bar.prototype.publish("yAxisTitleFontColor", null, "html-color", "Vertical Axis Title Text Style (Color)",null,{tags:['Intermediate','Shared']});

    Bar.prototype.publish("xAxisTitleFontSize", null, "number", "Horizontal Axis Titletext Style (Font Size)",null,{tags:['Intermediate','Shared']});
    Bar.prototype.publish("yAxisTitleFontSize", null, "number", "Vertical Axis Titletext Style (Font Size)",null,{tags:['Intermediate','Shared']});

    Bar.prototype.publish("xAxisTitleFontFamily", null, "string", "Horizontal Axis Title Text Style (Font Name)",null,{tags:['Intermediate','Shared']});
    Bar.prototype.publish("yAxisTitleFontFamily", null, "string", "Vertical Axis Title Text Style (Font Name)",null,{tags:['Intermediate','Shared']});

    Bar.prototype.publish("xAxisLabelRotation", 0, "number", "X Axis Label Angle",null,{tags:['Intermediate','Shared']});

    /**
     * Publish Params Unique To This Widget
     */
    Bar.prototype.publish("groupWidth", "", "string", "The width of a group of bars, Percent or Pixels",null,{tags:['Advanced']});
    Bar.prototype.publish("dataOpacity", 1.0, "number", "Transparency of Data Points",null,{tags:['Intermediate']});

    Bar.prototype.publish("xAxisBaseline", null, "number", "Specifies the color of the baseline for the horizontal axis",null,{tags:['Intermediate']});
    Bar.prototype.publish("yAxisBaseline", null, "number", "Specifies the color of the baseline for the vertical axis",null,{tags:['Intermediate']});

    Bar.prototype.publish("xAxisInversed", false, "boolean", "The Direction In Which The Values Along The Horizontal Axis Grow.",null,{tags:['Advanced']});
    Bar.prototype.publish("yAxisInversed", false, "boolean", "The Direction In Which The Values Along The Vertical Axis Grow.",null,{tags:['Advanced']});

    Bar.prototype.publish("xAxisFormat", "", "string", "Format String For Numeric Axis Labels", ["","decimal","scientific","currency","percent","short","long"],{tags:['Intermediate']});
    Bar.prototype.publish("yAxisFormat", "", "string", "Format String For Numeric Axis Labels", ["","decimal","scientific","currency","percent","short","long"],{tags:['Intermediate']});

    Bar.prototype.publish("xAxisGridlinesCount", 5, "number", "The Number of Horizontal Gridlines Between Two Regular Gridlines",null,{tags:['Intermediate']});
    Bar.prototype.publish("yAxisGridlinesCount", 5, "number", "The Number of Vertical Gridlines Between Two Regular Gridline",null,{tags:['Intermediate']});

    Bar.prototype.publish("xAxisGridlinesColor", null, "html-color", "The Color of The Horizontal Gridlines Inside The Chart Area",null,{tags:['Basic']});
    Bar.prototype.publish("yAxisGridlinesColor", null, "html-color", "The Color of The Vertical Gridlines Inside The Chart Area",null,{tags:['Basic']});

    Bar.prototype.publish("xAxisMinorGridlinesCount", 0, "number", "The Number of Horizontal Minor Gridlines Between Two Regular Gridlines",null,{tags:['Intermediate']});
    Bar.prototype.publish("yAxisMinorGridlinesCount", 0, "number", "The Number of Vertical Minor Gridlines Between Two Regular Gridlines",null,{tags:['Intermediate']});

    Bar.prototype.publish("xAxisMinorGridlinesColor", null, "html-color", "The Color of The Horizontal Minor Gridlines Inside The Chart Area",null,{tags:['Intermediate']});
    Bar.prototype.publish("yAxisMinorGridlinesColor", null, "html-color", "The Color of The Vertical Minor Gridlines Inside The Chart Area",null,{tags:['Intermediate']});

    Bar.prototype.publish("xAxisLogScale", false, "boolean", "Makes Horizontal Axis A log Scale",null,{tags:['Advanced']});
    Bar.prototype.publish("yAxisLogScale", false, "boolean", "Makes Vertical Axis A Log Scale",null,{tags:['Advanced']});

    Bar.prototype.publish("xAxisTextPosition", "out", "set", "Position of The Horizontal Axis Text, Relative To The Chart Area", ["out","in","none"],{tags:['Advanced']});
    Bar.prototype.publish("yAxisTextPosition", "out", "set", "Position of The Vertical Axis Text, Relative To The Chart Area", ["out","in","none"],{tags:['Advanced']});

    Bar.prototype.publish("xAxisTicks", [], "array", "Replaces The Automatically Generated X-Axis Ticks With The Specified Array",null,{tags:['Private']});
    Bar.prototype.publish("yAxisTicks", [], "array", "Replaces The Automatically Generated Y-Axis Ticks With The Specified Array",null,{tags:['Private']});

    Bar.prototype.publish("xAxisMaxValue", null, "number", "Moves The Max Value of The Horizontal Axis To The Specified Value",null,{tags:['Advanced']});
    Bar.prototype.publish("yAxisMaxValue", null, "number", "Moves The Max Value of The Vertical Axis To The Specified Value",null,{tags:['Advanced']});

    Bar.prototype.publish("xAxisMinValue", null, "number", "Moves The Min Value of The Horizontal Axis To The Specified Value",null,{tags:['Advanced']});
    Bar.prototype.publish("yAxisMinValue", null, "number", "Moves The Min Value of The Vertical Axis To The Specified Value",null,{tags:['Advanced']});

    Bar.prototype.publish("xAxisViewWindowMode", "pretty", "set", "Specifies How To Scale The Horizontal Axis To Render The values Within The Chart Area", ["pretty","maximized","explicit"],{tags:['Advanced']});
    Bar.prototype.publish("yAxisViewWindowMode", "pretty", "set", "Specifies How To Scale The Vertical Axis To Render The Values Within The Chart Area", ["pretty","maximized","explicit"],{tags:['Advanced']});

    Bar.prototype.publish("xAxisViewWindowMax", null, "number", "The Maximum Horizontal Data Value To Render",null,{tags:['Advanced']});
    Bar.prototype.publish("yAxisViewWindowMax", null, "number", "The Maximum Vertical Data Value To Render",null,{tags:['Advanced']});

    Bar.prototype.publish("xAxisViewWindowMin", null, "number", "The Minimum Horizontal Data Value To Render",null,{tags:['Advanced']});
    Bar.prototype.publish("yAxisViewWindowMin", null, "number", "The Minimum Vertical Data Value To Render",null,{tags:['Advanced']});

    Bar.prototype.getChartOptions = function () {
        var retVal = Common.prototype.getChartOptions.apply(this, arguments);

        retVal.dataOpacity = this.dataOpacity();
        retVal.isStacked = this.isStacked();
        retVal.bar = {
            groupWidth: this.groupWidth()
        };

        retVal.hAxis = {};
        retVal.vAxis = {};

        // hAxis
        retVal.hAxis.baseline = this.xAxisBaseline();
        retVal.hAxis.baselineColor = this.xAxisBaselineColor();
        retVal.hAxis.direction = this.xAxisInversed() ? -1 : 1;
        retVal.hAxis.gridlines = {
            count: this.xAxisGridlinesCount(),
            color: this.xAxisGridlinesColor()
        };
        retVal.hAxis.minorGridlines = {
            count: this.xAxisMinorGridlinesCount(),
            color: this.xAxisMinorGridlinesColor()
        };
        retVal.hAxis.logScale = this.xAxisLogScale();
        retVal.hAxis.textPosition = this.xAxisTextPosition();
        retVal.hAxis.title = this.xAxisTitle();
        retVal.hAxis.minValue = this.xAxisMinValue();
        retVal.hAxis.maxValue = this.xAxisMaxValue();
        retVal.hAxis.slantedText = this.xAxisLabelRotation() !== 0;
        retVal.hAxis.slantedTextAngle = this.xAxisLabelRotation();

        retVal.hAxis.format = this.xAxisFormat();
        retVal.hAxis.textStyle = {
            color: this.xAxisFontColor(),
            fontName: this.axisFontFamily() ? this.axisFontFamily() : this.fontFamily(),
            fontSize: this.axisFontSize() ? this.axisFontSize() : this.fontSize()

        };
        if (this.xAxisTicks().length > 0) {
            retVal.hAxis.ticks = this.xAxisTicks();
        }
        retVal.hAxis.titleTextStyle = {
            color: this.xAxisTitleFontColor(),
            fontName: this.xAxisTitleFontFamily(),
            fontSize: this.xAxisTitleFontSize()
        };
        retVal.hAxis.viewWindowMode = this.xAxisViewWindowMode();
        retVal.hAxis.viewWindow = {
            min: this.xAxisViewWindowMin(),
            max: this.xAxisViewWindowMax()
        };

        // vAxis
        retVal.vAxis.baseline = this.yAxisBaseline();
        retVal.vAxis.baselineColor = this.yAxisBaselineColor();
        retVal.vAxis.direction = this.yAxisInversed() ? -1 : 1;
        retVal.vAxis.gridlines = {
            count: this.yAxisGridlinesCount(),
            color: this.yAxisGridlinesColor()
        };
        retVal.vAxis.minorGridlines = {
            count: this.yAxisMinorGridlinesCount(),
            color: this.yAxisMinorGridlinesColor()
        };
        retVal.vAxis.logScale = this.yAxisLogScale();
        retVal.vAxis.textPosition = this.yAxisTextPosition();
        retVal.vAxis.title = this.yAxisTitle();
        retVal.vAxis.minValue = this.yAxisMinValue();
        retVal.vAxis.maxValue = this.yAxisMaxValue();

        retVal.vAxis.format = this.yAxisFormat();
        retVal.vAxis.textStyle = {
            color: this.yAxisFontColor(),
            fontName: this.axisFontFamily() ? this.axisFontFamily() : this.fontFamily(),
            fontSize: this.axisFontSize() ? this.axisFontSize() : this.fontSize()
        };
        if (this.yAxisTicks().length > 0) {
            retVal.vAxis.ticks = this.yAxisTicks();
        }
        retVal.vAxis.titleTextStyle = {
            color: this.yAxisTitleFontColor(),
            fontName: this.yAxisTitleFontFamily(),
            fontSize: this.yAxisTitleFontSize()
        };
        retVal.vAxis.viewWindowMode = this.yAxisViewWindowMode();
        retVal.vAxis.viewWindow = {
            min: this.yAxisViewWindowMin(),
            max: this.yAxisViewWindowMax()
        };
        return retVal;
    };

    Bar.prototype.updateChartOptions = function() {

        //this.chart.setBounds(120, 10, 170, 150); // padding/margin left right top down???

//        var x = this.chart.addCategoryAxis("x", "Subject");
//        var y = this.chart.addMeasureAxis("y","Value");
//
//        var s = this.chart.addSeries('Link', dimple.plot.bar);
        this.chart.axes = [];
        var x = this.chart.addCategoryAxis("x", ["Subject","Link"]);
        var y = this.chart.addMeasureAxis("y",'Value');

        //var s = this.chart.addSeries('Link', dimple.plot.bar);
        this.chart.series = [];
        console.log(this.chart);
        var s = this.chart.addSeries('Subject', dimple.plot.bar);

        s.barGap=0.7;

    };

    Bar.prototype.enter = function (domNode, element) {
        Common.prototype.enter.apply(this, arguments);
    };

    Bar.prototype.update = function (domNode, element) {
        Common.prototype.update.apply(this, arguments);
    };

//
//    Bar.prototype.testData = function() {
////        this.columns(["Subject", "Year 1", "Year 2", "Year 3"]);
////        this.data([
////            ["Geography", 75, 68, 65],
////            ["English", 45, 55, 52],
////            ["Math", 98, 92, 90],
////            ["Science", 66, 60, 66]
////        ]);
//        var dataArr = [];
//        this.data.forEach(function(dd, di) {
//           var dObj = {};
//           this.columns.foreach(function(cd,ci) {
//               dObj[cd] = cd[ci];
//           })
//           dataArr.push(dObj);
//        });
//        this.data([{
//                "Brand":"A",
//                "Day":"Mon",
//                "SalesVolume":10 },
//                {
//                "Brand":"B",
//                "Day":"Mon",
//                "SalesVolume":20
//                }]);
//
//
//        return this;
//    };

    return Bar;
}));
