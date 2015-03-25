/*
http://dygraphs.com/css.html
http://dygraphs.com/options.html
*/

//axisLabelFormatter 
//http://jsfiddle.net/eM2Mg/
//http://dygraphs.com/experimental/palette/?sample=sparse
//http://dygraphs.com/tests/charting-combinations.html
//http://dygraphs.com/tests/

//TODO
//interactionModel
//highlightSeriesOpts
//colorValue
//colorSaturation
//color
//colors
//strokeWidth .. idk if its per axis
//strokePattern per series .. idk if its per axis
//strokeBorderWidth
//strokeBorderColor
//stepPlot // per series and globally only
//pointSize
//plotter per series and general
//fillGraph // per series and general

//labelsDivStyles
//width
//height 

//labelsKMB
//labelsKMG2
//
//
//    dyChart.prototype.publish("annotations", null, "object", "000");
//    dyChart.prototype.publish("selection", null, "object", "000");

   


"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../common/HTMLWidget", "d3/d3", "../common/Palette", "dygraphs"], factory);
    } else {
        root.Entity = factory(root.HTMLWidget, root.d3, root.Palette, root.dygraphs);
    }
}(this, function (HTMLWidget, d3, Palette) {

    function dyChart() {
        HTMLWidget.call(this);
        this._class = "dygraph_dyChart";
        this._tag = "div";

        this._chart = null;

        this._axesList = ['x','y','y2'];


    };
    dyChart.prototype = Object.create(HTMLWidget.prototype);
    
    // Override Widget.publish
    dyChart.prototype.publish = function (id, defaultValue, type, description, set, ext) {
        if (this["__meta_" + id] !== undefined) {
            throw id + " is already published."
        }
        this["__meta_" + id] = {
            id: id,
            type: type,
            defaultValue: defaultValue,
            description: description,
            set: set,
            ext: ext || {}
        }
        this[id] = function (_) {
            if (!arguments.length) return this["_" + id];
            switch (type) {
                case "set":
                    if (typeof _ === "object") {            
                        // todo - check code
                    } else {
                        if (!set || set.indexOf(_) < 0) {
                            console.log("Invalid value for '" + id + "':  " + _);
                        }
                    }
                    break;
                case "html-color":
                    if (typeof _ === "object") {            
                        // todo - check code
                    } else {
                        var litmus = 'red';
                        var d = document.createElement('div');
                        d.style.color=litmus;
                        d.style.color=_;
                        //Element's style.color will be reverted to litmus or set to '' if an invalid color is given
                        if( _ !== litmus && (d.style.color === litmus || d.style.color === '')){
                            console.log("Invalid value for '" + id + "':  " + _);
                        }
                    }
                    break;
                case "boolean":
                    if (typeof _ === "object") {
                        for (var key in _) {
                            _[key] = Boolean(_[key]); // tis is correct
                        }
                    } else {
                        _ = Boolean(_);
                    }
                    break;
                case "number":
                    if (typeof _ === "object") {
                        for (var key in _) {
                            _[key] = Number(_[key]);
                        }
                    } else {
                        _ = Number(_);
                    }
                    break;
                case "string":
                    if (typeof _ === "object") {
                        for (var key in _) {
                            _[key] = String(_[key]); // tis is correct
                        }
                    } else {            
                        _ = String(_);
                    }
                    break;
                case "array":
                    if (typeof _ === "object") {
                        for (var key in _) {
                            // TODO - check code
                        }
                    } else {                    
                        if (!(_ instanceof Array)) {
                            console.log("Invalid value for '" + id);
                        }
                    }
                    break;
            }
            this["_" + id] = _;
            return this;
        };
        this[id + "_modified"] = function () {
            return this["_" + id] !== defaultValue;
        }
        this[id + "_reset"] = function () {
            this["_" + id] = defaultValue;
        }
        this["_" + id] = defaultValue;
    };

    dyChart.prototype._palette = Palette.ordinal("default"); // or impliment INDChart ??
    dyChart.prototype.publish("paletteID", "default", "set", "Palette ID", dyChart.prototype._palette.switch());
    
    dyChart.prototype.publish("dataHandler", null, "function", "");
    dyChart.prototype.publish("valueFormatter", {'x':null,'y':null,'y2':null}, "function", "");
    
    
    dyChart.prototype.publish("rollPeriod", 14, "number", "Number of days in which to average data");
    dyChart.prototype.publish("showRangeSelector", false, "boolean", "000");
    dyChart.prototype.publish("labelsFromColumns", true, "boolean", "000");
    dyChart.prototype.publish("legend", "", "set", "Legend Options", ["", "always", "follow"]);
    dyChart.prototype.publish("showRoller", false, "boolean", "000");

    dyChart.prototype.publish("annotationClickHandler", null, "function", "Called whenever the user clicks on an annotation");
    dyChart.prototype.publish("annotationDblClickHandler", null, "function", "000");
    dyChart.prototype.publish("annotationMouseOutHandler", null, "function", "000");
    dyChart.prototype.publish("annotationMouseOverHandler", null, "function", "000");


    dyChart.prototype.publish("annotations", null, "object", "000");
    dyChart.prototype.publish("selection", null, "object", "000");
    dyChart.prototype.publish("visibility", [], "array", "000");
    
    dyChart.prototype.publish("customOptions", null, "object", "000");

    // Axis
    dyChart.prototype.publish("axisLabelColor", {'x':"#000000",'y':"#000000",'y2':"#000000"}, "html-color", "");
    dyChart.prototype.publish("axisLabelFontSize", {'x':14,'y':14,'y2':14}, "number", "");
    dyChart.prototype.publish("axisLabelFormatter", {x:null,y:null,y2:null}, "function", "");
    dyChart.prototype.publish("axisLabelWidth", {x:60,y:50}, "number", ""); 
    dyChart.prototype.publish("axisLineColor", {'x':"#000000",'y':"#000000",'y2':"#000000"}, "html-color", "");
    dyChart.prototype.publish("axisLineWidth", {x:0.3,y:0.3}, "number", "");
    dyChart.prototype.publish("axisTickSize", {x:3,y:3}, "number", "");
    
    dyChart.prototype.publish("dateWindow", [], "array", ""); // ??
    
    dyChart.prototype.publish("drawAxesAtZero", false, "boolean", "");
    dyChart.prototype.publish("drawAxis", {'x':true,'y':true,'y2':false}, "boolean", "");
    
    dyChart.prototype.publish("includeZero", false, "boolean", "");
    dyChart.prototype.publish("independentTicks", {'y':true,'y2':false}, "boolean", ""); // only for y's
    dyChart.prototype.publish("gridLineWidth", {'x':0.3,'y':0.3}, "number", "");

    dyChart.prototype.publish("labelsUTC", false, "boolean", "");
    dyChart.prototype.publish("labelsKMB", {'y':false,'y2':false}, "boolean", "");
    dyChart.prototype.publish("labelsKMG2", {'y':false,'y2':false}, "boolean", "");
    
    dyChart.prototype.publish("logscale", false, "boolean", "");
    dyChart.prototype.publish("panEdgeFraction", null, "number", "");
    
    dyChart.prototype.publish("pixelsPerLabel", {'x':70,'y':30}, "number", ""); // Default: 70 (x-axis) or 30 (y-axes)
    
    dyChart.prototype.publish("ticker", {x:null,y:null,y2:null}, "function", "");
    
    dyChart.prototype.publish("valueRange", [], "array", "");
    
    dyChart.prototype.publish("xAxisHeight", null, "number", ""); // make an inject 
    dyChart.prototype.publish("xRangePad", 0, "number", "");
    dyChart.prototype.publish("yRangePad", null, "number", "");
    
    
    // CSV parsing 
    dyChart.prototype.publish("errorBars", false, "boolean", "000");
    dyChart.prototype.publish("fractions", false, "boolean", "000");
    dyChart.prototype.publish("customBars", false, "boolean", "000"); // only works with certain data
    /*
      errorBars: [x, [value1, std1], [value2, std2], ...]
      fractions: [x, [num1, den1], [num2, den2], ...]
      customBars: [x, [low1, val1, high1], [low2, val2, high2], ...]
    */   
   
    dyChart.prototype.publish("delimiter", ",", "string", "Chart Title");
    
    dyChart.prototype.publish("xValueParser", null, "function", "");
    
    // Callbacks
    dyChart.prototype.publish("clickCallback", null, "function", ""); // canvas click
    dyChart.prototype.publish("pointClickCallback", null, "function", ""); // data-point click
    dyChart.prototype.publish("drawCallback", null, "function", "");
    dyChart.prototype.publish("highlightCallback", null, "function", "");
    dyChart.prototype.publish("underlayCallback", null, "function", "");
    dyChart.prototype.publish("unhighlightCallback", null, "function", "");
    dyChart.prototype.publish("zoomCallback", null, "function", "");
    
    dyChart.prototype.publish("drawHighlightPointCallback", null, "function", ""); // callback
    dyChart.prototype.publish("drawPointCallback", null, "function", ""); // callback

    // Chart labels
    dyChart.prototype.publish("title", "", "string", "Chart Title");
    dyChart.prototype.publish("titleHeight", 18, "number", "Chart Title Height");
    
    // Config
    dyChart.prototype.publish("plugins", [], "array", "");
    
    // Data Line display
    dyChart.prototype.publish("connectSeparatedPoints", false, "boolean", "");
    dyChart.prototype.publish("drawGapEdgePoints", false, "boolean", "");
    
    dyChart.prototype.publish("drawPoints", false, "boolean", "");
    dyChart.prototype.publish("fillGraph", false, "boolean", "");
    dyChart.prototype.publish("plotter", null, "function", "");
    
    // only works when drawpoints = true
    dyChart.prototype.publish("g_pointSize", 1, "number", ""); // g and s becuase not sure how to handle this where it can be n series and in general
    dyChart.prototype.publish("s_pointSize", 1, "number", "");


    dyChart.prototype.publish("stackedGraph", false, "boolean", "");
    dyChart.prototype.publish("stackedGraphNaNFill", "all", "set",null,["all","inside","none"]);
    dyChart.prototype.publish("stepPlot", false, "boolean", "");
    dyChart.prototype.publish("strokeBorderColor", "#FFFFFF", "html-color", "");
    dyChart.prototype.publish("strokeBorderWidth ", null, "number", ""); // make an inject
    dyChart.prototype.publish("strokePattern", null, "array", ""); // make an inject or blank array?
    dyChart.prototype.publish("strokeWidth", 1.0, "number", "");
    
    // Other misc.
    dyChart.prototype.publish("sigma", 2.0, "number", "");
    dyChart.prototype.publish("fillAlpha", 0.15, "number", "");
    dyChart.prototype.publish("wilsonInterval", false, "boolean", "");
     
    dyChart.prototype.publish("yLabelWidth", 18.0, "number", "");
    dyChart.prototype.publish("y2Label", "", "string", "");
    dyChart.prototype.publish("xLabel", "", "string", "");    
    dyChart.prototype.publish("xLabelHeight", 18, "number", "Chart Title Height");
    dyChart.prototype.publish("yLabel", "", "string", "Y-Axis Label");

    // Grid

    dyChart.prototype.publish("drawGrid", {'y':true,'x':true,'y2':false}, "boolean", "");
    dyChart.prototype.publish("gridLineColor", "#808080", "html-color", "");
    dyChart.prototype.publish("gridLinePattern", [], "array", "");

    // Interactive Elements

    dyChart.prototype.publish("animatedZooms", false, "boolean", "");
    dyChart.prototype.publish("hideOverlayOnMouseOut", false, "boolean", "");
    dyChart.prototype.publish("highlightCircleSize", 3.0, "number", "");
    dyChart.prototype.publish("highlightSeriesBackgroundAlpha", 0.5, "number", "");


    dyChart.prototype.publish("highlightSeriesOpts", null, "object", "");
    dyChart.prototype.publish("interactionModel", null, "object", "");

    dyChart.prototype.publish("rangeSelectorHeight", 40, "number", "");
    dyChart.prototype.publish("rangeSelectorPlotFillColor", "#A7B1C4", "html-color", "");
    dyChart.prototype.publish("rangeSelectorPlotStrokeColor", "#808FAB", "html-color", "");

    dyChart.prototype.publish("showInRangeSelector", null, "boolean", ""); // per series ... make null?? for none??

    dyChart.prototype.publish("showLabelsOnHighlight", true, "boolean", "");

    dyChart.prototype.publish("labelsDivWidth", 250, "number", "");
    dyChart.prototype.publish("labelsSeparateLines", false, "boolean", "");
    dyChart.prototype.publish("labelsShowZeroValues", false, "boolean", "");

    dyChart.prototype.publish("rightGap", 5.0, "number", "");
    dyChart.prototype.publish("digitsAfterDecimal", 2.0, "number", "");

    dyChart.prototype.publish("maxNumberWidth", 6, "number", "");

    dyChart.prototype.publish("sigFigs", null, "number", ""); 

       
    dyChart.prototype.enter = function (domNode, element) {
        this._chart = new Dygraph(domNode,[[0]],{width:this.width(),height:this.height()}); // our weird way of init with 0 data ... width and height must be set on init
        // width and height resize TODO cause there is a resize func
    };
    
    dyChart.prototype.loadDygraphConfig = function(_) {
        // TODO
        return;
    }

    dyChart.prototype.getChartOptions = function () {
        var colors = this._columns.filter(function (d, i) { return i > 0; }).map(function (row) {
            return this._palette(row);
        }, this);
        

        var chartOptions = { 
            'file': this._data,
            //'height':,
            //'width':
            //'dataHandler':this.dataHandler(),
            'plotter': this.plotter(),
            'legend': this.legend(),
            'rightGap': this.rightGap(),
            'title': this.title(),
            'titleHeight': this.titleHeight(),
            'showRoller': this.showRoller(),
            'rollPeriod': this.rollPeriod(),
            
            'ylabel': this.yLabel(),
            'yLabelWidth': this.yLabelWidth(),
            
            'y2label': this.y2Label(),
            
            'xlabel': this.xLabel(),
            'xLabelHeight': this.xLabelHeight(),
            'labelsDiv': null,
            'labelsDivStyles': {
                'textAlign': 'right'
            },
            'showLabelsOnHighlight': this.showLabelsOnHighlight(),
            'hideOverlayOnMouseOut': this.hideOverlayOnMouseOut(),

            'labelsDivWidth': this.labelsDivWidth(),
            'labelsSeparateLines': this.labelsSeparateLines(),
            'labelsShowZeroValues': this.labelsShowZeroValues(),

            'showRangeSelector': this.showRangeSelector(),
            'rangeSelectorHeight': this.rangeSelectorHeight(),
            'rangeSelectorPlotFillColor': this.rangeSelectorPlotFillColor(),
            'rangeSelectorPlotStrokeColor': this.rangeSelectorPlotStrokeColor(),

            'errorBars': this.errorBars(),
            'fractions': this.showRangeSelector(),
            'customBars': this.customBars(),

            'sigma': this.sigma(),
            'fillAlpha': this.fillAlpha(),
            'connectSeparatedPoints': this.connectSeparatedPoints(),
            'drawGapEdgePoints': this.drawGapEdgePoints(),
            'stackedGraphNaNFill': this.stackedGraphNaNFill(),
            'stackedGraph': this.stackedGraph(),

            
            'drawPoints': this.drawPoints(),
            'fillGraph': this.fillGraph(),



            'drawAxesAtZero': this.drawAxesAtZero(), // might be used diff doesnt work here .. so far doc says its used here

            
            'includeZero': this.includeZero(),
            
            'labelsUTC': this.labelsUTC(),
            'logscale': this.logscale(), // this could be per x,y axis
            'panEdgeFraction': this.panEdgeFraction(),

            'maxNumberWidth':this.maxNumberWidth(),
            'sigFigs':this.sigFigs(),
            'digitsAfterDecimal': this.digitsAfterDecimal(),

            'highlightSeriesBackgroundAlpha': this.highlightSeriesBackgroundAlpha(),
            'highlightCircleSize': this.highlightCircleSize(),

            'animatedZooms': this.animatedZooms(),

            'yRangePad': this.yRangePad(),
            'xRangePad': this.xRangePad(),
            'xAxisHeight': this.xAxisHeight(),
            
            //'visibility': [false,true,true], DOES NOT WORK FREEZES widget
            'series': {

            },
            'axes': {

            }

            
        };

        var perSeriesParams = ["showInRangeSelector","",""];
        // gridLineWidth ?????
        // labelsKMG2 and labelsKMB ... also for others can u do main and per axis and whats the diff and how to handle that

        var perAxisParams = [
            "drawAxis","pixelsPerLabel","valueFormatter","independentTicks","gridLineWidth","gridLinePattern","gridLineColor","drawGrid","labelsKMB","labelsKMG2","valueRange",
            "axisLabelColor","axisLabelFontSize","axisLabelWidth","axisLineColor","axisLineWidth","axisTickSize","axisLabelFormatter","ticker"
        ];
        for (var i = 0, j = this._axesList.length; i < j; i++) {
             chartOptions['axes'][this._axesList[i]] = {}; // init
             for (var axisIdx = 0; axisIdx < perAxisParams.length; axisIdx++) {
                var val = typeof this[perAxisParams[axisIdx]]()[this._axesList[i]] !=='undefined' ? this[perAxisParams[axisIdx]]()[this._axesList[i]] : this['__meta_'+perAxisParams[axisIdx]].defaultValue[this._axesList[i]]; // the better way
                if (val === 'undefined' || val === null) {
                    continue;
                }
                chartOptions['axes'][this._axesList[i]][perAxisParams[axisIdx]] = val;
            }
        }         


        if (colors.length > 0) { chartOptions.colors = colors; }

        //if (this.axisLabelFormatter() !== null) { chartOptions.axisLabelFormatter = this.axisLabelFormatter(); } // has to be like this
        if (this.dateWindow().length > 0) { chartOptions.dateWindow = this.dateWindow(); }
                
        // labels
        if (this.columns().length > 0) { chartOptions.labels = this.columns(); }

        // click callbacks
        if (this.clickCallback() != null) { chartOptions.clickCallback = this.clickCallback(); }
        if (this.pointClickCallback() != null) { chartOptions.pointClickCallback = this.pointClickCallback(); }

        if (this.annotationMouseOverHandler() != null) { chartOptions.annotationMouseOverHandler = this.annotationMouseOverHandler(); }
        if (this.annotationMouseOutHandler() != null) { chartOptions.annotationMouseOutHandler = this.annotationMouseOutHandler(); }
        if (this.annotationDblClickHandler() != null) { chartOptions.annotationDblClickHandler = this.annotationDblClickHandler(); }
        if (this.annotationClickHandler() != null) { chartOptions.annotationClickHandler = this.annotationClickHandler(); }

        if (this.drawCallback() != null) { chartOptions.drawCallback = this.drawCallback(); }
        if (this.highlightCallback() != null) { chartOptions.highlightCallback = this.highlightCallback(); }
        if (this.underlayCallback() != null) { chartOptions.underlayCallback = this.underlayCallback(); }
        if (this.unhighlightCallback() != null) { chartOptions.unhighlightCallback = this.unhighlightCallback(); }
        if (this.zoomCallback() != null) { chartOptions.zoomCallback = this.zoomCallback(); }
        if (this.drawHighlightPointCallback() != null) { chartOptions.drawHighlightPointCallback = this.drawHighlightPointCallback(); }
        if (this.drawPointCallback() != null) { chartOptions.drawPointCallback = this.drawPointCallback(); }

        


        console.log(chartOptions);
        console.log(this.loadDygraphConfig());
        /*
        return {
            'file': this._data,
            'drawPoints': "true",
            'series': {
                'x1': {

                }
            }
        }
        */
        return chartOptions;   
    };

    dyChart.prototype.update = function (domNode, element) {
        this._palette = this._palette.switch(this._paletteID);
        
        var isZoomedIgnoreProgrammaticZoom = false;
        
        if (this.customOptions() != null) {
            this._chart.updateOptions(this.customOptions());
        } else {
            this._chart.updateOptions(this.getChartOptions(),isZoomedIgnoreProgrammaticZoom);
        }
        
        
    };

    dyChart.prototype.exit = function (domNode, element) {
        this._chart.destroy();
    };
    
    // Other functions

    dyChart.prototype.adjustRoll = function(_) {
        return this._chart.adjustRoll(_);
    }

    dyChart.prototype.annotations = function(ann, supressDraw) {
        if (!arguments.length) return this._chart.annotations();
        return this._chart.setAnnotations(ann, supressDraw);
    }

    dyChart.prototype.clearSelection = function() {
        return this._chart.clearSelection();
    }

    dyChart.prototype.destroy = function() {
        return this._chart.destroy();
    }

    dyChart.prototype.eventToDomCoords = function(event) {
        return this._chart.eventToDomCoords(event);
    }

    dyChart.prototype.getArea = function() {
        return this._chart.getArea();
    }

    dyChart.prototype.getArea = function() {
        return this._chart.getArea();
    }
    
    dyChart.prototype.getColors = function() {
        return this._chart.getColors();
    }

    dyChart.prototype.getHighlightSeries = function() {
        return this._chart.getHighlightSeries();
    }

    dyChart.prototype.getLabels = function() {
        return this._chart.getLabels();
    }
    
    dyChart.prototype.getOption = function(name, opt_seriesName) {
        return this._chart.getOption(name, opt_seriesName);
    }    

    dyChart.prototype.getOption = function(name, opt_seriesName) {
        return this._chart.getOption(name, opt_seriesName);
    }      

    dyChart.prototype.getPropertiesForSeries = function(series_name) {
        return this._chart.getPropertiesForSeries(series_name);
    }    

    dyChart.prototype.selection = function(row, seriesName, locked) {
        if (!arguments.length) return this._chart.getSelection();
        return this._chart.setSelection(row, seriesName, locked);
    }  
    
    dyChart.prototype.getValue = function(row, col) {
        return this._chart.getValue(row, col);
    }  

    dyChart.prototype.getValue = function(row, col) {
        return this._chart.getValue(row, col);
    }  

    dyChart.prototype.indexFromSetName = function(name) {
        return this._chart.indexFromSetName(name);
    }  

    dyChart.prototype.isSeriesLocked = function() {
        return this._chart.isSeriesLocked();
    } 

    dyChart.prototype.isZoomed = function(axis) {
        return this._chart.isZoomed(axis);
    } 

    dyChart.prototype.numAxes = function() {
        return this._chart.numAxes();
    } 

    // need to integrate this into columns function
    dyChart.prototype.numColumns = function() {
        return this._chart.numColumns();
    } 
    
    dyChart.prototype.numRows = function() {
        return this._chart.numRows();
    } 

    dyChart.prototype.ready = function(callback) {
        return this._chart.ready(callback);
    } 

    dyChart.prototype.resetZoom = function() {
        return this._chart.resetZoom();
    } 
    
    dyChart.prototype.resize = function(width, height) {
        return this._chart.resize(width, height);
    }     

    dyChart.prototype.resize = function(width, height) {
        return this._chart.resize(width, height);
    } 
    
    dyChart.prototype.wvisibility = function(num, value) {
        if (!arguments.length) return this._chart.visibility();
        return this._chart.setVisibility(num, value);
    } 

    dyChart.prototype.toDataCoords = function(x, y, axis) {
        return this._chart.toDataCoords(x, y, axis);
    } 

    dyChart.prototype.toDataXCoord = function(x) {
        return this._chart.toDataXCoord(x);
    } 

    dyChart.prototype.toDataYCoord = function(y) {
        return this._chart.toDataYCoord(y);
    } 

    dyChart.prototype.toDomCoords = function(x, y, axis) {
        return this._chart.toDomCoords(x, y, axis);
    } 

    dyChart.prototype.toDomXCoord = function(x) {
        return this._chart.toDomXCoord(x);
    } 
 
    dyChart.prototype.toDomYCoord = function(y, axis) {
        return this._chart.toDomYCoord(y, axis);
    }

    dyChart.prototype.toPercentXCoord = function(x) {
        return this._chart.toPercentXCoord(x);
    }

    dyChart.prototype.toPercentYCoord = function(y, axis) {
        return this._chart.toPercentYCoord(y, axis);
    }

    dyChart.prototype.toString = function() {
        return this._chart.toString();
    }
    
    // update options func or leave in .update ???
    
    dyChart.prototype.xAxisExtremes = function() {
        return this._chart.xAxisExtremes();
    }    

    dyChart.prototype.xAxisRange = function() {
        return this._chart.xAxisRange();
    } 

    dyChart.prototype.yAxisRange = function(idx) {
        if (!arguments.length) return this._chart.yAxisRanges();
        return this._chart.yAxisRange(idx);
    } 
    
    // runs any function that might not be listed here
    dyChart.prototype.runNative = function(func, b) {
        var args = Array.prototype.splice.call(arguments, 1);
        return this._chart[func].apply(null, args);
    }
    
    
    dyChart.prototype.testData = function(_) {
        this.columns(["Date","High","Low"])
        this._data = 
            "20070101,62,39\n" + "20070102,62,44\n" + "20070103,62,42\n" + "20070104,57,45\n" + "20070105,54,44\n" + "20070106,55,36\n" + "20070107,62,45\n" + "20070108,66,48\n" + "20070109,63,39\n" + "20070110,57,37\n" + "20070111,50,37\n" + "20070112,48,35\n" + "20070113,48,30\n" + "20070114,48,28\n" + "20070115,53,28\n" + "20070116,50,30\n" + "20070117,57,37\n" + "20070118,61,33\n" + "20070119,55,35\n" + "20070120,61,35\n" + "20070121,64,43\n" + "20070122,61,36\n" + "20070123,57,35\n" + "20070124,60,35\n" + "20070125,55,39\n" + "20070126,54,44\n" + "20070127,57,48\n" + "20070128,59,45\n" + "20070129,63,45\n" + "20070130,59,41\n" + "20070131,55,48\n" + "20070201,53,46\n" + "20070202,55,44\n" + "20070203,59,37\n" + "20070204,66,39\n" + "20070205,64,43\n" + "20070206,61,46\n" + "20070207,61,51\n" + "20070208,60,51\n" + "20070209,61,55\n" + "20070210,62,55\n" + "20070211,61,46\n" + "20070212,59,43\n" + "20070213,57,46\n" + "20070214,61,39\n" + "20070215,64,44\n" + "20070216,71,46\n" + "20070217,73,51\n" + "20070218,60,46\n" + "20070219,63,44\n" + "20070220,57,45\n" + "20070221,59,48\n" + "20070222,55,44\n" + "20070223,55,42\n" + "20070224,57,39\n" + "20070225,55,48\n" + "20070226,57,44\n" + "20070227,53,39\n" + "20070228,53,37\n" + "20070301,54,37\n" + "20070302,61,39\n" + "20070303,66,43\n" + "20070304,70,48\n" + "20070305,68,53\n" + "20070306,69,46\n" + "20070307,62,51\n" + "20070308,61,46\n" + "20070309,60,45\n" + "20070310,68,46\n" + "20070311,79,48\n" + "20070312,80,52\n" + "20070313,73,53\n" + "20070314,64,48\n" + "20070315,78,46\n" + "20070316,78,50\n" + "20070317,62,51\n" + "20070318,66,46\n" + "20070319,64,48\n" + "20070320,60,48\n" + "20070321,66,46\n" + "20070322,73,43\n" + "20070323,78,48\n" + "20070324,68,48\n" + "20070325,64,53\n" + "20070326,66,48\n" + "20070327,57,46\n" + "20070328,66,42\n" + "20070329,73,42\n" + "20070330,72,46\n" + "20070331,69,46\n" + "20070401,64,46\n" + "20070402,69,46\n" + "20070403,71,46\n" + "20070404,69,50\n" + "20070405,71,52\n" + "20070406,64,52\n" + "20070407,68,51\n" + "20070408,71,51\n" + "20070409,66,50\n" + "20070410,72,46\n" + "20070411,63,50\n" + "20070412,64,46\n" + "20070413,70,44\n" + "20070414,57,51\n" + "20070415,68,46\n" + "20070416,75,46\n" + "20070417,62,48\n" + "20070418,61,45\n" + "20070419,57,42\n" + "20070420,64,46\n" + "20070421,61,43\n" + "20070422,63,48\n" + "20070423,70,44\n" + "20070424,66,46\n" + "20070425,66,48\n" + "20070426,69,48\n" + "20070427,82,50\n" + "20070428,81,55\n" + "20070429,70,53\n" + "20070430,77,51\n" + "20070501,70,48\n" + "20070502,66,52\n" + "20070503,63,48\n" + "20070504,64,51\n" + "20070505,73,46\n" + "20070506,88,54\n" + "20070507,91,57\n" + "20070508,84,60\n" + "20070509,73,55\n" + "20070510,57,52\n" + "20070511,64,51\n" + "20070512,64,50\n" + "20070513,72,46\n" + "20070514,66,50\n" + "20070515,63,51\n" + "20070516,70,48\n" + "20070517,68,50\n" + "20070518,73,50\n" + "20070519,70,52\n" + "20070520,73,51\n" + "20070521,78,54\n" + "20070522,81,51\n" + "20070523,86,55\n" + "20070524,78,55\n" + "20070525,69,54\n" + "20070526,69,55\n" + "20070527,69,54\n" + "20070528,73,52\n" + "20070529,69,53\n" + "20070530,66,55\n" + "20070531,64,54\n" + "20070601,66,54\n" + "20070602,64,54\n" + "20070603,70,55\n" + "20070604,73,59\n" + "20070605,68,55\n" + "20070606,70,53\n" + "20070607,75,51\n" + "20070608,70,50\n" + "20070609,75,53\n" + "20070610,75,55\n" + "20070611,75,53\n" + "20070612,79,52\n" + "20070613,90,59\n" + "20070614,89,60\n" + "20070615,86,59\n" + "20070616,72,55\n" + "20070617,79,53\n" + "20070618,79,57\n" + "20070619,73,55\n" + "20070620,71,55\n" + "20070621,77,55\n" + "20070622,79,54\n" + "20070623,77,54\n" + "20070624,77,53\n" + "20070625,82,53\n" + "20070626,71,54\n" + "20070627,73,55\n" + "20070628,73,57\n" + "20070629,77,60\n" + "20070630,75,54\n" + "20070701,78,54\n" + "20070702,82,57\n" + "20070703,72,57\n" + "20070704,84,59\n" + "20070705,84,61\n" + "20070706,75,60\n" + "20070707,73,55\n" + "20070708,78,55\n" + "20070709,73,57\n" + "20070710,73,59\n" + "20070711,78,62\n" + "20070712,75,59\n" + "20070713,79,60\n" + "20070714,73,60\n" + "20070715,78,62\n" + "20070716,75,59\n" + "20070717,77,60\n" + "20070718,75,63\n" + "20070719,80,59\n" + "20070720,79,59\n" + "20070721,77,61\n" + "20070722,75,63\n" + "20070723,79,64\n" + "20070724,73,61\n" + "20070725,72,57\n" + "20070726,75,60\n" + "20070727,78,60\n" + "20070728,77,57\n" + "20070729,73,57\n" + "20070730,80,59\n" + "20070731,75,59\n" + "20070801,75,59\n" + "20070802,73,60\n" + "20070803,79,60\n" + "20070804,77,59\n" + "20070805,71,57\n" + "20070806,71,59\n" + "20070807,73,57\n" + "20070808,71,55\n" + "20070809,77,60\n" + "20070810,77,57\n" + "20070811,73,57\n" + "20070812,72,55\n" + "20070813,75,55\n" + "20070814,73,55\n" + "20070815,75,57\n" + "20070816,79,60\n" + "20070817,80,55\n" + "20070818,78,57\n" + "20070819,77,55\n" + "20070820,80,64\n" + "20070821,82,62\n" + "20070822,82,60\n" + "20070823,82,57\n" + "20070824,78,59\n" + "20070825,73,61\n" + "20070826,73,61\n" + "20070827,78,59\n" + "20070828,86,62\n" + "20070829,88,68\n" + "20070830,90,68\n" + "20070831,80,66\n" + "20070901,87,62\n" + "20070902,89,61\n" + "20070903,78,61\n" + "20070904,78,63\n" + "20070905,89,57\n" + "20070906,82,64\n" + "20070907,75,61\n" + "20070908,73,62\n" + "20070909,71,61\n" + "20070910,73,59\n" + "20070911,71,59\n" + "20070912,72,60\n" + "20070913,77,57\n" + "20070914,75,60\n" + "20070915,73,57\n" + "20070916,72,61\n" + "20070917,72,55\n" + "20070918,73,55\n" + "20070919,66,55\n" + "20070920,71,52\n" + "20070921,77,57\n" + "20070922,64,57\n" + "20070923,68,55\n" + "20070924,78,52\n" + "20070925,84,53\n" + "20070926,87,57\n" + "20070927,75,55\n" + "20070928,66,54\n" + "20070929,73,52\n" + "20070930,75,48\n" + "20071001,71,57\n" + "20071002,81,53\n" + "20071003,73,54\n" + "20071004,69,55\n" + "20071005,64,50\n" + "20071006,73,45\n" + "20071007,77,46\n" + "20071008,79,53\n" + "20071009,72,53\n" + "20071010,69,54\n" + "20071011,70,48\n" + "20071012,64,54\n" + "20071013,70,53\n" + "20071014,66,51\n" + "20071015,68,52\n" + "20071016,66,52\n" + "20071017,66,50\n" + "20071018,73,50\n" + "20071019,72,57\n" + "20071020,66,54\n" + "20071021,73,51\n" + "20071022,81,51\n" + "20071023,84,53\n" + "20071024,79,55\n" + "20071025,66,53\n" + "20071026,68,46\n" + "20071027,66,52\n" + "20071028,75,52\n" + "20071029,63,55\n" + "20071030,63,53\n" + "20071031,63,54\n" + "20071101,66,53\n" + "20071102,77,50\n" + "20071103,80,48\n" + "20071104,77,48\n" + "20071105,66,48\n" + "20071106,62,52\n" + "20071107,61,48\n" + "20071108,59,53\n" + "20071109,63,48\n" + "20071110,66,48\n" + "20071111,63,48\n" + "20071112,68,44\n" + "20071113,72,51\n" + "20071114,75,55\n" + "20071115,69,51\n" + "20071116,63,55\n" + "20071117,66,51\n" + "20071118,64,53\n" + "20071119,66,48\n" + "20071120,63,46\n" + "20071121,64,43\n" + "20071122,64,37\n" + "20071123,70,37\n" + "20071124,60,37\n" + "20071125,60,46\n" + "20071126,63,42\n" + "20071127,63,45\n" + "20071128,64,46\n" + "20071129,62,41\n" + "20071130,55,42\n" + "20071201,57,37\n" + "20071202,61,45\n" + "20071203,66,50\n" + "20071204,61,54\n" + "20071205,60,50\n" + "20071206,57,48\n" + "20071207,55,45\n" + "20071208,53,42\n" + "20071209,57,39\n" + "20071210,57,39\n" + "20071211,57,41\n" + "20071212,55,35\n" + "20071213,59,34\n" + "20071214,55,34\n" + "20071215,55,39\n" + "20071216,55,43\n" + "20071217,57,48\n" + "20071218,57,43\n" + "20071219,59,41\n" + "20071220,55,43\n" + "20071221,53,39\n" + "20071222,53,32\n" + "20071223,55,37\n" + "20071224,57,45\n" + "20071225,57,37\n" + "20071226,53,43\n" + "20071227,48,37\n" + "20071228,48,43\n" + "20071229,57,44\n" + "20071230,52,43\n" + "20071231,57,42\n";
        
        return this;
    }

        
    return dyChart;
}));

        /*
        this._data = 
            "2007-01-01,46;51;56,43;45;48\n" +
            "2007-01-02,43;48;52,48;56;63\n" +
            "2007-01-03,39;46;53,50;54;62\n" +
            "2007-01-04,44;51;58,45;52;56\n" +
            "2007-01-05,51;57;62,44;49;58\n" +
            "2007-01-06,55;64;72,40;50;60\n" +
            "2007-01-07,46;51;56,45;53;63\n" +
            "2007-01-08,40;49;57,43;53;64\n" +
            "2007-01-09,37;41;45,49;56;66\n" +
            "2007-01-10,31;35;38,45;49;54\n" +
            "2007-01-11,29;35;41,41;46;54\n" +
            "2007-01-12,39;45;50,41;44;49\n" +
            "2007-01-13,46;52;57,38;44;53\n" +
            "2007-01-14,42;44;46,36;43;51\n" +
            "2007-01-15,41;46;51,36;46;55\n" +
            "2007-01-16,25;41;57,37;45;54\n" +
            "2007-01-17,21;26;31,41;47;56\n" +
            "2007-01-18,25;32;38,38;48;61\n"
        ;
        */