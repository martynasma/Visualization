/*
http://dygraphs.com/css.html
http://dygraphs.com/options.html
*/
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

        this.chart = null;

    };
    dyChart.prototype = Object.create(HTMLWidget.prototype);
    
    dyChart.prototype._palette = Palette.ordinal("default"); // or impliment INDChart ??
    dyChart.prototype.publish("paletteID", "default", "set", "Palette ID", dyChart.prototype._palette.switch());
    
    dyChart.prototype.publish("title", "", "string", "Chart Title");
    dyChart.prototype.publish("yLabel", "", "string", "Y-Axis Label");
    dyChart.prototype.publish("customBars", false, "boolean", "???"); // only works with certain data
    dyChart.prototype.publish("rollPeriod", 14, "number", "Number of days in which to average data");
    dyChart.prototype.publish("showRangeSelector", false, "boolean", "???");
    dyChart.prototype.publish("labelsFromColumns", true, "boolean", "???");
    dyChart.prototype.publish("legend", "", "set", "Legend Options", ["", "always", "follow"]);
    dyChart.prototype.publish("showRoller", false, "boolean", "???");

    dyChart.prototype.publish("annotationClickHandler", null, "function", "Called whenever the user clicks on an annotation");
    dyChart.prototype.publish("annotationDblClickHandler", null, "function", "???");
    dyChart.prototype.publish("annotationMouseOutHandler", null, "function", "???");
    dyChart.prototype.publish("annotationMouseOverHandler", null, "function", "???");

    dyChart.prototype.publish("clickCallback", null, "function", "???"); // canvas click
    dyChart.prototype.publish("pointClickCallback", null, "function", "???"); // data-point click

    
    dyChart.prototype.enter = function (domNode, element) {

        this.chart = new Dygraph(domNode,[[0]],{width:this.width(),height:this.height()}); // our weird way of init with 0 data ... width and height must be set on init
 
    };
    
    dyChart.prototype.getChartOptions = function () {
        var colors = this._columns.filter(function (d, i) { return i > 0; }).map(function (row) {
            return this._palette(row);
        }, this);
        
        var chartOptions = { 
            'file': this._data,
            
            'legend': this.legend(),
            'title': this.title(),
            'showRoller': this.showRoller(),
            'rollPeriod': this.rollPeriod(),
            'customBars': this.customBars(),
            'ylabel': this.yLabel(),
            'labelsDivStyles' : {
                'textAlign' : 'right'
            },
            'showRangeSelector' : this.showRangeSelector()
        };
        
        if (colors.length > 0) { chartOptions.colors = colors; }
        
        // labels
        if (this.columns().length > 0) { chartOptions.labels = this.columns(); }

        // click callbacks
        if (this.clickCallback() != null) { chartOptions.clickCallback = this.clickCallback(); }
        if (this.pointClickCallback() != null) { chartOptions.pointClickCallback = this.pointClickCallback(); }

        if (this.annotationMouseOverHandler() != null) { chartOptions.annotationMouseOverHandler = this.annotationMouseOverHandler(); }
        if (this.annotationMouseOutHandler() != null) { chartOptions.annotationMouseOutHandler = this.annotationMouseOutHandler(); }
        if (this.annotationDblClickHandler() != null) { chartOptions.annotationDblClickHandler = this.annotationDblClickHandler(); }
        if (this.annotationClickHandler() != null) { chartOptions.annotationClickHandler = this.annotationClickHandler(); }
        
        return chartOptions;
        
    };

    dyChart.prototype.update = function (domNode, element) {
        this._palette = this._palette.switch(this._paletteID);
        
        this.chart.updateOptions(this.getChartOptions());

    };

    dyChart.prototype.exit = function (domNode, element) {
        this.chart.destroy();
    };

    dyChart.prototype.testData = function(_) {

        this.columns(["Date","High","Low"])
        this._data = 
            "20070101,62,39\n" + "20070102,62,44\n" + "20070103,62,42\n" + "20070104,57,45\n" + "20070105,54,44\n" + "20070106,55,36\n" + "20070107,62,45\n" + "20070108,66,48\n" + "20070109,63,39\n" + "20070110,57,37\n" + "20070111,50,37\n" + "20070112,48,35\n" + "20070113,48,30\n" + "20070114,48,28\n" + "20070115,53,28\n" + "20070116,50,30\n" + "20070117,57,37\n" + "20070118,61,33\n" + "20070119,55,35\n" + "20070120,61,35\n" + "20070121,64,43\n" + "20070122,61,36\n" + "20070123,57,35\n" + "20070124,60,35\n" + "20070125,55,39\n" + "20070126,54,44\n" + "20070127,57,48\n" + "20070128,59,45\n" + "20070129,63,45\n" + "20070130,59,41\n" + "20070131,55,48\n" + "20070201,53,46\n" + "20070202,55,44\n" + "20070203,59,37\n" + "20070204,66,39\n" + "20070205,64,43\n" + "20070206,61,46\n" + "20070207,61,51\n" + "20070208,60,51\n" + "20070209,61,55\n" + "20070210,62,55\n" + "20070211,61,46\n" + "20070212,59,43\n" + "20070213,57,46\n" + "20070214,61,39\n" + "20070215,64,44\n" + "20070216,71,46\n" + "20070217,73,51\n" + "20070218,60,46\n" + "20070219,63,44\n" + "20070220,57,45\n" + "20070221,59,48\n" + "20070222,55,44\n" + "20070223,55,42\n" + "20070224,57,39\n" + "20070225,55,48\n" + "20070226,57,44\n" + "20070227,53,39\n" + "20070228,53,37\n" + "20070301,54,37\n" + "20070302,61,39\n" + "20070303,66,43\n" + "20070304,70,48\n" + "20070305,68,53\n" + "20070306,69,46\n" + "20070307,62,51\n" + "20070308,61,46\n" + "20070309,60,45\n" + "20070310,68,46\n" + "20070311,79,48\n" + "20070312,80,52\n" + "20070313,73,53\n" + "20070314,64,48\n" + "20070315,78,46\n" + "20070316,78,50\n" + "20070317,62,51\n" + "20070318,66,46\n" + "20070319,64,48\n" + "20070320,60,48\n" + "20070321,66,46\n" + "20070322,73,43\n" + "20070323,78,48\n" + "20070324,68,48\n" + "20070325,64,53\n" + "20070326,66,48\n" + "20070327,57,46\n" + "20070328,66,42\n" + "20070329,73,42\n" + "20070330,72,46\n" + "20070331,69,46\n" + "20070401,64,46\n" + "20070402,69,46\n" + "20070403,71,46\n" + "20070404,69,50\n" + "20070405,71,52\n" + "20070406,64,52\n" + "20070407,68,51\n" + "20070408,71,51\n" + "20070409,66,50\n" + "20070410,72,46\n" + "20070411,63,50\n" + "20070412,64,46\n" + "20070413,70,44\n" + "20070414,57,51\n" + "20070415,68,46\n" + "20070416,75,46\n" + "20070417,62,48\n" + "20070418,61,45\n" + "20070419,57,42\n" + "20070420,64,46\n" + "20070421,61,43\n" + "20070422,63,48\n" + "20070423,70,44\n" + "20070424,66,46\n" + "20070425,66,48\n" + "20070426,69,48\n" + "20070427,82,50\n" + "20070428,81,55\n" + "20070429,70,53\n" + "20070430,77,51\n" + "20070501,70,48\n" + "20070502,66,52\n" + "20070503,63,48\n" + "20070504,64,51\n" + "20070505,73,46\n" + "20070506,88,54\n" + "20070507,91,57\n" + "20070508,84,60\n" + "20070509,73,55\n" + "20070510,57,52\n" + "20070511,64,51\n" + "20070512,64,50\n" + "20070513,72,46\n" + "20070514,66,50\n" + "20070515,63,51\n" + "20070516,70,48\n" + "20070517,68,50\n" + "20070518,73,50\n" + "20070519,70,52\n" + "20070520,73,51\n" + "20070521,78,54\n" + "20070522,81,51\n" + "20070523,86,55\n" + "20070524,78,55\n" + "20070525,69,54\n" + "20070526,69,55\n" + "20070527,69,54\n" + "20070528,73,52\n" + "20070529,69,53\n" + "20070530,66,55\n" + "20070531,64,54\n" + "20070601,66,54\n" + "20070602,64,54\n" + "20070603,70,55\n" + "20070604,73,59\n" + "20070605,68,55\n" + "20070606,70,53\n" + "20070607,75,51\n" + "20070608,70,50\n" + "20070609,75,53\n" + "20070610,75,55\n" + "20070611,75,53\n" + "20070612,79,52\n" + "20070613,90,59\n" + "20070614,89,60\n" + "20070615,86,59\n" + "20070616,72,55\n" + "20070617,79,53\n" + "20070618,79,57\n" + "20070619,73,55\n" + "20070620,71,55\n" + "20070621,77,55\n" + "20070622,79,54\n" + "20070623,77,54\n" + "20070624,77,53\n" + "20070625,82,53\n" + "20070626,71,54\n" + "20070627,73,55\n" + "20070628,73,57\n" + "20070629,77,60\n" + "20070630,75,54\n" + "20070701,78,54\n" + "20070702,82,57\n" + "20070703,72,57\n" + "20070704,84,59\n" + "20070705,84,61\n" + "20070706,75,60\n" + "20070707,73,55\n" + "20070708,78,55\n" + "20070709,73,57\n" + "20070710,73,59\n" + "20070711,78,62\n" + "20070712,75,59\n" + "20070713,79,60\n" + "20070714,73,60\n" + "20070715,78,62\n" + "20070716,75,59\n" + "20070717,77,60\n" + "20070718,75,63\n" + "20070719,80,59\n" + "20070720,79,59\n" + "20070721,77,61\n" + "20070722,75,63\n" + "20070723,79,64\n" + "20070724,73,61\n" + "20070725,72,57\n" + "20070726,75,60\n" + "20070727,78,60\n" + "20070728,77,57\n" + "20070729,73,57\n" + "20070730,80,59\n" + "20070731,75,59\n" + "20070801,75,59\n" + "20070802,73,60\n" + "20070803,79,60\n" + "20070804,77,59\n" + "20070805,71,57\n" + "20070806,71,59\n" + "20070807,73,57\n" + "20070808,71,55\n" + "20070809,77,60\n" + "20070810,77,57\n" + "20070811,73,57\n" + "20070812,72,55\n" + "20070813,75,55\n" + "20070814,73,55\n" + "20070815,75,57\n" + "20070816,79,60\n" + "20070817,80,55\n" + "20070818,78,57\n" + "20070819,77,55\n" + "20070820,80,64\n" + "20070821,82,62\n" + "20070822,82,60\n" + "20070823,82,57\n" + "20070824,78,59\n" + "20070825,73,61\n" + "20070826,73,61\n" + "20070827,78,59\n" + "20070828,86,62\n" + "20070829,88,68\n" + "20070830,90,68\n" + "20070831,80,66\n" + "20070901,87,62\n" + "20070902,89,61\n" + "20070903,78,61\n" + "20070904,78,63\n" + "20070905,89,57\n" + "20070906,82,64\n" + "20070907,75,61\n" + "20070908,73,62\n" + "20070909,71,61\n" + "20070910,73,59\n" + "20070911,71,59\n" + "20070912,72,60\n" + "20070913,77,57\n" + "20070914,75,60\n" + "20070915,73,57\n" + "20070916,72,61\n" + "20070917,72,55\n" + "20070918,73,55\n" + "20070919,66,55\n" + "20070920,71,52\n" + "20070921,77,57\n" + "20070922,64,57\n" + "20070923,68,55\n" + "20070924,78,52\n" + "20070925,84,53\n" + "20070926,87,57\n" + "20070927,75,55\n" + "20070928,66,54\n" + "20070929,73,52\n" + "20070930,75,48\n" + "20071001,71,57\n" + "20071002,81,53\n" + "20071003,73,54\n" + "20071004,69,55\n" + "20071005,64,50\n" + "20071006,73,45\n" + "20071007,77,46\n" + "20071008,79,53\n" + "20071009,72,53\n" + "20071010,69,54\n" + "20071011,70,48\n" + "20071012,64,54\n" + "20071013,70,53\n" + "20071014,66,51\n" + "20071015,68,52\n" + "20071016,66,52\n" + "20071017,66,50\n" + "20071018,73,50\n" + "20071019,72,57\n" + "20071020,66,54\n" + "20071021,73,51\n" + "20071022,81,51\n" + "20071023,84,53\n" + "20071024,79,55\n" + "20071025,66,53\n" + "20071026,68,46\n" + "20071027,66,52\n" + "20071028,75,52\n" + "20071029,63,55\n" + "20071030,63,53\n" + "20071031,63,54\n" + "20071101,66,53\n" + "20071102,77,50\n" + "20071103,80,48\n" + "20071104,77,48\n" + "20071105,66,48\n" + "20071106,62,52\n" + "20071107,61,48\n" + "20071108,59,53\n" + "20071109,63,48\n" + "20071110,66,48\n" + "20071111,63,48\n" + "20071112,68,44\n" + "20071113,72,51\n" + "20071114,75,55\n" + "20071115,69,51\n" + "20071116,63,55\n" + "20071117,66,51\n" + "20071118,64,53\n" + "20071119,66,48\n" + "20071120,63,46\n" + "20071121,64,43\n" + "20071122,64,37\n" + "20071123,70,37\n" + "20071124,60,37\n" + "20071125,60,46\n" + "20071126,63,42\n" + "20071127,63,45\n" + "20071128,64,46\n" + "20071129,62,41\n" + "20071130,55,42\n" + "20071201,57,37\n" + "20071202,61,45\n" + "20071203,66,50\n" + "20071204,61,54\n" + "20071205,60,50\n" + "20071206,57,48\n" + "20071207,55,45\n" + "20071208,53,42\n" + "20071209,57,39\n" + "20071210,57,39\n" + "20071211,57,41\n" + "20071212,55,35\n" + "20071213,59,34\n" + "20071214,55,34\n" + "20071215,55,39\n" + "20071216,55,43\n" + "20071217,57,48\n" + "20071218,57,43\n" + "20071219,59,41\n" + "20071220,55,43\n" + "20071221,53,39\n" + "20071222,53,32\n" + "20071223,55,37\n" + "20071224,57,45\n" + "20071225,57,37\n" + "20071226,53,43\n" + "20071227,48,37\n" + "20071228,48,43\n" + "20071229,57,44\n" + "20071230,52,43\n" + "20071231,57,42\n";
        
        return this;
    }
    
    return dyChart;
}));
