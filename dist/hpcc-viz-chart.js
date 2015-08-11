if (typeof define === "function" && define.amd) {
  define('css',[], function () { 
    return {
      load: function ($1, $2, load) { load() }
    } 
  })
};


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/XYAxis.js',["d3", "../common/SVGWidget", "css!./XYAxis"], factory);
    } else {
        root.chart_XYAxis = factory(root.d3, root.common_SVGWidget);
    }
}(this, function (d3, SVGWidget) {
    function XYAxis(target) {
        SVGWidget.call(this);
        this._drawStartPos = "origin";

        this._dateParserData = d3.time.format("%Y-%m-%d").parse;
        this._dateParserValue = d3.time.format("%Y-%m-%d").parse;
    }
    XYAxis.prototype = Object.create(SVGWidget.prototype);
    XYAxis.prototype.constructor = XYAxis;
    XYAxis.prototype._class += " chart_XYAxis";

    XYAxis.prototype.publish("orientation", "horizontal", "set", "Selects orientation for the axis", ["horizontal", "vertical"]);

    XYAxis.prototype.publish("selectionMode", false, "boolean", "Range Selector");
    XYAxis.prototype.publish("xAxisType", "ordinal", "set", "X-Axis Type", ["ordinal", "linear", "time"]);
    XYAxis.prototype.publish("xAxisTypeTimePattern", "%Y-%m-%d", "string", "Time Series Pattern");
    XYAxis.prototype.publish("xAxisDomainLow", "", "string", "X-Axis Low");
    XYAxis.prototype.publish("xAxisDomainHigh", "", "string", "X-Axis High");

    XYAxis.prototype.publish("yAxisTitle", "", "string", "Y-Axis Title");
    XYAxis.prototype.publish("yAxisTickCount", 10, "number", "Y-Axis Tick Count");
    XYAxis.prototype.publish("yAxisTickFormat", "s", "string", "Y-Axis Tick Format");
    XYAxis.prototype.publish("yAxisType", "linear", "set", "Y-Axis Type", ["none", "linear", "pow", "log", "time"]);
    XYAxis.prototype.publish("yAxisTypeTimePattern", "%Y-%m-%d", "string", "Time Series Pattern");
    XYAxis.prototype.publish("yAxisTypePowExponent", 2, "number", "Exponent for Pow on Value Axis");
    XYAxis.prototype.publish("yAxisTypeLogBase", 10, "number", "Base for log on Value Axis");
    XYAxis.prototype.publish("yAxisDomainLow", "", "string", "Y-Axis Low");
    XYAxis.prototype.publish("yAxisDomainHigh", "", "string", "Y-Axis High");
    XYAxis.prototype.publish("yAxisDomainPadding", 5, "number", "Y-Axis Low/High Padding (if no low/high specified");

    XYAxis.prototype.publish("regions", [], "array", "Regions");

    XYAxis.prototype.publish("sampleData", "", "set", "Display Sample Data", ["", "ordinal", "ordinalRange", "linear", "time-x", "time-y"]);

    XYAxis.prototype._sampleData = XYAxis.prototype.sampleData;
    XYAxis.prototype.sampleData = function (_) {
        var retVal = XYAxis.prototype._sampleData.apply(this, arguments);
        if (arguments.length) {
            switch (_) {
                case "ordinal":
                    this.testDataOrdinal();
                    break;
                case "ordinalRange":
                    this.testDataOrdinalRange();
                    break;
                case "linear":
                    this.testDataLinear();
                    break;
                case "time-x":
                    this.testDataTimeX();
                    break;
                case "time-y":
                    this.testDataTimeY();
                    break;
            }
        }
        return retVal;
    };

    XYAxis.prototype.resetSelection = function () {
        this._prevBrush = null;
        return this;
    };

    //  Data ---
    XYAxis.prototype.testData = function () {
        this.sampleData("ordinal");
        return this;
    };

    XYAxis.prototype.testDataOrdinal = function () {
        this
            .xAxisType("ordinal")
            .yAxisType("linear")
            .columns(["Subject", "Year 1", "Year 2", "Year 3"])
            .data([
                ["Geography", 75, 68, 65],
                ["English", 45, "55", 52],
                ["Math", 98, 92, 90],
                ["Science", 66, null, 56]
            ])
        ;
        return this;
    };

    XYAxis.prototype.testDataOrdinalRange = function () {
        this
            .xAxisType("ordinal")
            .yAxisType("linear")
            .columns(["Region", "May", "June", "July"])
            .data([
                ["Munster", [1, 11], [2, 14], [8, 18]],
                ["Leinster", [3, 10], [1, 15], ["7", 16]],
                ["Ulster", [2, 14], [5, 12], [8, 17]],
                ["Connacht", [0, 10], [1, 12], [7, 16]]
            ])
        ;
        return this;
    };

    XYAxis.prototype.testDataLinear = function () {
        this
            .xAxisType("linear")
            .yAxisType("linear")
            .columns(["Subject", "2nd Year"])
            .data([
                [10, 75],
                [13, 45],
                [14, 45],
                [15, 85],
                [16, 98],
                [19, 66]
            ])
        ;
        return this;
    };

    XYAxis.prototype.testDataTimeX = function () {
        var rawData = [{ "DateTime": "2014-06-01T07:01:39", "Price": 821 }, { "DateTime": "2015-12-01T01:33:35", "Price": 841 }, { "DateTime": "2015-12-25T23:58:34", "Price": 1356 }, { "DateTime": "2015-05-16T17:02:17", "Price": 1136 }, { "DateTime": "2015-09-11T10:37:50", "Price": 1094 }, { "DateTime": "2014-11-03T21:34:47", "Price": 1266 }, { "DateTime": "2015-11-05T12:31:45", "Price": 1159 }, { "DateTime": "2014-11-27T16:25:57", "Price": 1572 }, { "DateTime": "2015-12-26T15:13:48", "Price": 1083 }, { "DateTime": "2014-06-18T16:21:06", "Price": 1324 }, { "DateTime": "2014-05-13T05:35:12", "Price": 1553 }, { "DateTime": "2014-06-01T20:40:50", "Price": 1216 }, { "DateTime": "2015-07-15T07:19:39", "Price": 1403 }, { "DateTime": "2016-03-17T09:32:59", "Price": 1382 }, { "DateTime": "2015-05-28T02:24:27", "Price": 1337 }, { "DateTime": "2015-08-08T18:46:00", "Price": 1084 }, { "DateTime": "2015-10-25T15:42:48", "Price": 1217 }, { "DateTime": "2016-01-07T00:48:47", "Price": 1464 }, { "DateTime": "2015-12-13T23:21:16", "Price": 894 }, { "DateTime": "2014-06-13T22:49:52", "Price": 967 }, { "DateTime": "2015-01-07T20:33:03", "Price": 1033 }, { "DateTime": "2015-02-28T10:08:16", "Price": 1119 }, { "DateTime": "2015-11-09T15:33:56", "Price": 1298 }, { "DateTime": "2015-04-18T00:05:19", "Price": 808 }, { "DateTime": "2016-04-19T04:09:19", "Price": 1331 }, { "DateTime": "2015-11-26T05:03:53", "Price": 1221 }, { "DateTime": "2014-09-17T08:59:31", "Price": 1450 }, { "DateTime": "2016-03-29T15:34:22", "Price": 1403 }, { "DateTime": "2015-09-13T13:46:01", "Price": 1088 }, { "DateTime": "2014-12-04T20:41:36", "Price": 1503 }, { "DateTime": "2015-06-19T12:43:51", "Price": 1350 }, { "DateTime": "2014-05-21T12:58:46", "Price": 874 }, { "DateTime": "2016-02-11T07:48:56", "Price": 1519 }, { "DateTime": "2015-02-23T22:35:44", "Price": 1383 }, { "DateTime": "2015-11-28T11:35:45", "Price": 928 }, { "DateTime": "2016-01-17T10:27:12", "Price": 941 }, { "DateTime": "2015-02-04T07:17:50", "Price": 1076 }, { "DateTime": "2016-04-11T08:28:10", "Price": 907 }, { "DateTime": "2015-02-27T15:02:35", "Price": 1263 }, { "DateTime": "2016-03-23T15:54:53", "Price": 911 }, { "DateTime": "2014-09-26T19:15:38", "Price": 1076 }, { "DateTime": "2015-10-15T15:13:47", "Price": 1052 }, { "DateTime": "2015-04-07T13:22:52", "Price": 1481 }, { "DateTime": "2016-01-31T11:15:52", "Price": 1248 }, { "DateTime": "2014-11-20T09:46:51", "Price": 1360 }, { "DateTime": "2015-10-19T15:05:26", "Price": 1094 }, { "DateTime": "2016-04-30T09:54:01", "Price": 1552 }, { "DateTime": "2015-06-07T23:49:49", "Price": 1329 }, { "DateTime": "2015-07-10T20:12:46", "Price": 801 }, { "DateTime": "2014-12-22T19:11:04", "Price": 1066 }, { "DateTime": "2015-12-07T17:03:07", "Price": 1032 }, { "DateTime": "2015-11-30T13:11:22", "Price": 1546 }, { "DateTime": "2014-06-29T07:24:44", "Price": 1042 }, { "DateTime": "2014-08-03T08:15:25", "Price": 1326 }, { "DateTime": "2015-09-01T20:32:23", "Price": 928 }, { "DateTime": "2016-05-02T12:56:47", "Price": 1550 }, { "DateTime": "2014-11-18T04:38:21", "Price": 972 }, { "DateTime": "2016-05-03T01:05:51", "Price": 1164 }, { "DateTime": "2015-02-03T17:16:07", "Price": 998 }, { "DateTime": "2015-09-04T21:29:16", "Price": 1199 }, { "DateTime": "2015-12-02T10:44:32", "Price": 1250 }, { "DateTime": "2016-01-26T16:11:51", "Price": 1241 }, { "DateTime": "2015-05-30T12:42:11", "Price": 1336 }, { "DateTime": "2014-09-11T10:19:44", "Price": 1231 }, { "DateTime": "2016-04-06T05:54:55", "Price": 1276 }, { "DateTime": "2016-02-18T00:29:49", "Price": 939 }, { "DateTime": "2014-11-16T15:35:04", "Price": 1557 }, { "DateTime": "2015-12-10T03:06:01", "Price": 1292 }, { "DateTime": "2015-05-31T04:19:33", "Price": 1347 }, { "DateTime": "2014-10-08T17:26:41", "Price": 1041 }, { "DateTime": "2015-01-13T10:43:21", "Price": 1089 }, { "DateTime": "2015-04-14T04:05:10", "Price": 999 }, { "DateTime": "2015-10-05T11:47:54", "Price": 1520 }, { "DateTime": "2015-06-26T00:22:00", "Price": 1342 }, { "DateTime": "2015-05-13T14:32:54", "Price": 976 }, { "DateTime": "2015-07-13T19:13:18", "Price": 1576 }, { "DateTime": "2014-05-17T21:59:02", "Price": 1220 }, { "DateTime": "2015-03-15T07:15:00", "Price": 1230 }, { "DateTime": "2015-02-22T22:04:01", "Price": 1510 }, { "DateTime": "2015-11-26T06:03:07", "Price": 816 }, { "DateTime": "2014-07-02T20:20:52", "Price": 1343 }, { "DateTime": "2015-07-14T13:10:03", "Price": 1285 }, { "DateTime": "2015-11-01T03:18:14", "Price": 1424 }, { "DateTime": "2015-03-17T12:04:38", "Price": 1109 }, { "DateTime": "2015-11-19T05:47:16", "Price": 1278 }, { "DateTime": "2015-11-12T09:03:53", "Price": 841 }, { "DateTime": "2014-10-17T18:37:00", "Price": 1425 }, { "DateTime": "2015-09-27T04:37:49", "Price": 1555 }, { "DateTime": "2015-07-30T04:01:21", "Price": 1222 }, { "DateTime": "2015-02-11T17:59:08", "Price": 1464 }, { "DateTime": "2014-09-13T19:57:59", "Price": 1271 }, { "DateTime": "2015-03-25T10:55:59", "Price": 1397 }, { "DateTime": "2014-07-13T09:36:47", "Price": 915 }, { "DateTime": "2015-02-15T10:49:48", "Price": 1015 }, { "DateTime": "2014-10-24T08:50:59", "Price": 835 }, { "DateTime": "2016-01-14T18:23:43", "Price": 1088 }, { "DateTime": "2016-03-05T04:11:37", "Price": 1573 }, { "DateTime": "2014-08-09T06:02:06", "Price": 1504 }, { "DateTime": "2015-05-25T07:47:41", "Price": 1326 }, { "DateTime": "2016-02-11T06:53:58", "Price": 1525 }];
        rawData.sort(function (l, r) {
            if (l.DateTime > r.DateTime) {
                return 1;
            }
            if (l.DateTime < r.DateTime) {
                return -1;
            }
            return 0;
        });
        return this
            .xAxisType("time")
            .xAxisTypeTimePattern("%Y-%m-%dT%H:%M:%S")
            .yAxisType("linear")
            .columns(["Date", "Price1", "Price2", "Price3"])
            .data(rawData.map(function (row, idx) {
                switch (idx % 3) {
                    case 0:
                        return [row.DateTime, row.Price, null, null];
                    case 1:
                        return [row.DateTime, null, row.Price, null];
                    case 2:
                        return [row.DateTime, null, null, row.Price];
                }
            }))
        ;
    };

    XYAxis.prototype.testDataTimeY = function () {
        return this
            .xAxisType("ordinal")
            .yAxisType("time")
            .yAxisTypeTimePattern("%Y-%m-%d")
            .columns(["Subject", "Year 1"])
            .data([
                ["Geography", "2010-07-09"],
                ["English", "2010-07-12"],
                ["Math", null],
                ["Science", "2010-07-21"]
            ])
        ;
    };

    var xAxisTypeTimePattern = XYAxis.prototype.xAxisTypeTimePattern;
    XYAxis.prototype.xAxisTypeTimePattern = function (_) {
        var retVal = xAxisTypeTimePattern.apply(this, arguments);
        if (arguments.length) {
            this._dateParserData = d3.time.format(_).parse;
        }
        return retVal;
    };

    var yAxisTypeTimePattern = XYAxis.prototype.yAxisTypeTimePattern;
    XYAxis.prototype.yAxisTypeTimePattern = function (_) {
        var retVal = yAxisTypeTimePattern.apply(this, arguments);
        if (arguments.length) {
            this._dateParserValue = d3.time.format(_).parse;
        }
        return retVal;
    };

    XYAxis.prototype.columns = function (_) {
        return SVGWidget.prototype.columns.apply(this, arguments);
    };

    XYAxis.prototype.formatData = function (d) {
        switch (this.xAxisType()) {
            case "time":
                return this._dateParserData(d);
            default:
                return d;
        }
    };

    XYAxis.prototype.formatValue = function (d) {
        if (!d) {
            return d;
        }
        if (d instanceof Array) {
            return d.map(function (item) {
                return this.formatValue(item);
            }, this);
        } 
        switch (this.yAxisType()) {
            case "time":
                return this._dateParserValue(d);
            default:
                if (typeof d === "string") {
                    return +d;
                }
                return d;
        }
    };

    XYAxis.prototype.formattedData = function () {
        return this.data().map(function (row) {
            return row.map(function (cell, idx) {
                if (idx === 0) {
                    return this.formatData(cell);
                } if (idx >= this._columns.length) {
                    return cell;
                }
                return this.formatValue(cell);
            }, this);
        }, this);
    };

    XYAxis.prototype.enter = function (domNode, element) {
        this.dataAxis = d3.svg.axis()
            .orient("bottom")
        ;

        this.valueAxis = d3.svg.axis()
            .orient("left")
        ;

        this.svg = element.append("g");
        this.svgRegions = element.append("g");
        this.svgData = this.svg.append("g");
        this.svgXAxis = this.svg.append("g");
        this.svgXAxisText = this.svgXAxis.append("text")
            .attr("y", -2)
            .style("text-anchor", "end")
        ;
        this.svgYAxis = this.svg.append("g");
        this.svgYAxisText = this.svgYAxis.append("text")
              .attr("transform", "rotate(-90)")
              .attr("x", -2)
              .attr("y", 2)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
        ;

        //  Brush  ---
        this.svgBrush = element.append("g")
            .attr("class", "brush")
        ;
        var context = this;
        this.xBrush = d3.svg.brush()
            .on("brush", function () {
                return context.brushMoved.apply(context, arguments);
            })
        ;
        this.yBrush = d3.svg.brush()
            .on("brush", function () {
                return context.brushMoved.apply(context, arguments);
            })
        ;
    };

    XYAxis.prototype.resizeBrushHandle = function (d, width, height) {
        var e, x, y;
        if (d === "e" || d === "w") {
            e = +(d === "e");
            x = e ? 1 : -1;
            y = height / 3;
            return "M" + (0.5 * x) + "," + y +
                "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) +
                "V" + (2 * y - 6) +
                "A6,6 0 0 " + e + " " + (0.5 * x) + "," + (2 * y) +
                "Z" +
                "M" + (2.5 * x) + "," + (y + 8) +
                "V" + (2 * y - 8) +
                "M" + (4.5 * x) + "," + (y + 8) +
                "V" + (2 * y - 8);
        } else {
            e = +(d === "s");
            y = e ? 1 : -1;
            x = width / 3;
            return "M" + x + ", " + (0.5 * y) +
                "A6,6 0 0 " + (e + 1) % 2 + " " + (x + 6) + "," + (6.5 * y) +
                "H" + (2 * x - 6) +
                "A6,6 0 0 " + (e + 1) % 2 + " " + (2 * x) + "," + (0.5 * y) +
                "Z" +
                "M" + (x + 8) + "," + (2.5 * y) +
                "H" + (2 * x - 8) +
                "M" + (x + 8) + "," + (4.5 * y) +
                "H" + (2 * x - 8);
        }
    };

    XYAxis.prototype.brushMoved = SVGWidget.prototype.debounce(function brushed() {
        var selected = this.formattedData().filter(function (d) {
            var pos;
            switch (this.xAxisType()) {
                case "ordinal":
                    pos = this.dataScale(d[0]) + (this.dataScale.rangeBand ? this.dataScale.rangeBand() / 2 : 0);
                    if (this.orientation() === "horizontal") {
                        return (pos >= this.xBrush.extent()[0] && pos <= this.xBrush.extent()[1]);
                    } else {
                        return (pos >= this.yBrush.extent()[0] && pos <= this.yBrush.extent()[1]);
                    }
                    break;
                default:
                    pos = d[0];
                    if (this.orientation() === "horizontal") {
                        return (pos >= this.xBrush.extent()[0] && pos <= this.xBrush.extent()[1]);
                    } else {
                        return (pos >= this.yBrush.extent()[0] && pos <= this.yBrush.extent()[1]);
                    }
                    break;
            }
        }, this);
        this.selection(selected);
    }, 250);

    XYAxis.prototype.dataPos = function (label) {
        var retVal = this.dataScale(this.formatData(label));
        if (this.xAxisType() === "ordinal") {
            retVal += this.dataScale.rangeBand() / 2;
        }
        return retVal;
    };

    XYAxis.prototype.valuePos = function (value) {
        return this.valueScale(this.formatValue(value));
    };

    XYAxis.prototype.calcMargin = function (domNode, element) {
        var margin = { top: this.selectionMode() ? 10 : 2, right: this.selectionMode() ? 10 : 2, bottom: this.selectionMode() ? 10 : 2, left: this.selectionMode() ? 10 : 2 };
        var height = this.height() - margin.top - margin.bottom;

        var test = element.append("g");

        var svgXAxis = test.append("g")
            .attr("class", this.orientation() === "horizontal" ? "x axis" : "y axis")
            .attr("transform", "translate(0," + height + ")")
            .call(this.currAxis)
        ;
        var x_bbox = svgXAxis.node().getBBox();
        margin.right -= (this.width() - x_bbox.width - x_bbox.x);
        margin.bottom = x_bbox.height;

        if (this.yAxisType() !== "none") {
            var svgYAxis = test.append("g")
                .attr("class", this.orientation() === "horizontal" ? "y axis" : "x axis")
                .call(this.otherAxis)
            ;
            var y_bbox = svgYAxis.node().getBBox();
            margin.left = y_bbox.width;
            margin.top -= y_bbox.y;
        }

        test.remove();
        return margin;
    };

    XYAxis.prototype.update = function (domNode, element) {
        var context = this;

        var regions = this.svgRegions.selectAll(".region").data(this.regions());
        regions.enter().append("rect")
            .attr("class", "region")
        ;
        if (this.orientation() === "horizontal") {
            regions
                .attr("x", function (d) { return context.dataPos(d.x0); })
                .attr("y", 0)
                .attr("width", function (d) { return context.dataPos(d.x1) - context.dataPos(d.x0); })
                .attr("height", this.height())
                .style("stroke", function (d) { return context._palette(d.colorID); })
                .style("fill", function (d) { return d3.hsl(context._palette(d.colorID)).brighter(); })
            ;
        } else {
            regions
                .attr("x", 0)
                .attr("y", function (d) { return context.dataPos(d.x0); })
                .attr("width", this.width())
                .attr("height", function (d) { return context.dataPos(d.x0) - context.dataPos(d.x1); })
                .style("stroke", function (d) { return context._palette(d.colorID); })
                .style("fill", function (d) { return d3.hsl(context._palette(d.colorID)).brighter(); })
            ;
        }
        regions.exit().remove();

        if (this._prevXAxisType !== this.xAxisType()) {
            this._prevXAxisType = this.xAxisType();
            this._prevBrush = null;
            switch (this.xAxisType()) {
                case "linear":
                    this.dataScale = d3.scale.linear();
                    break;
                case "time":
                    this.dataScale = d3.time.scale();
                    break;
                case "ordinal":
                    /* falls through */
                default:
                    this.dataScale = d3.scale.ordinal();
                    break;
            }
            this.dataAxis
                .scale(this.dataScale)
            ;
            this.xBrush
                .x(this.dataScale)
            ;
            this.yBrush
                .y(this.dataScale)
            ;
        }

        switch (this.yAxisType()) {
            case "pow":
                this.valueScale = d3.scale.pow()
                    .exponent(this.yAxisTypePowExponent())
                ;
                break;
            case "log":
                this.valueScale = d3.scale.log()
                    .base(this.yAxisTypeLogBase())
                ;
                break;
            case "time":
                this.valueScale = d3.time.scale();
                break;
            case "linear":
                /* falls through */
            default:
                this.valueScale = d3.scale.linear();
                break;
        }
        this.valueAxis
            .scale(this.valueScale)
            .ticks(this.yAxisTickCount(), this.yAxisTickFormat())
        ;

        var isHorizontal = this.orientation() === "horizontal";
        this.dataAxis.orient(isHorizontal ? "bottom" : "left");
        this.valueAxis.orient(isHorizontal ? "left" : "bottom");
        this.currAxis = isHorizontal ? this.dataAxis : this.valueAxis;
        this.otherAxis = isHorizontal ? this.valueAxis : this.dataAxis;
        var currBrush = isHorizontal ? this.xBrush : this.yBrush;
        var otherBrush = isHorizontal ? this.yBrush : this.xBrush;
        var otherBrushExtent = otherBrush.extent();

        //  Update Domain  ---
        switch (this.xAxisType()) {
            case "ordinal":
                this.dataScale.domain(this.data().map(function (d) { return d[0]; }));
                break;
            default:
                var domainMin = this.xAxisDomainLow() ? this.formatData(this.xAxisDomainLow()) : d3.min(this.formattedData(), function (data) {
                    return data[0];
                });
                var domainMax = this.xAxisDomainHigh() ? this.formatData(this.xAxisDomainHigh()) : d3.max(this.formattedData(), function (data) {
                    return data[0];
                });
                this.dataScale.domain([domainMin, domainMax]);
                break;
        }

        var min = this.yAxisDomainLow() ? this.formatValue(this.yAxisDomainLow()) : d3.min(this.formattedData(), function (data) {
            return d3.min(data.filter(function (cell, i) { return i > 0 && context._columns[i] && context._columns[i].indexOf("__") !== 0 && cell !== null; }), function (d) { return d instanceof Array ? d[0] : d; });
        });
        var max = this.yAxisDomainHigh() ? this.formatValue(this.yAxisDomainHigh()) : d3.max(this.formattedData(), function (data) {
            return d3.max(data.filter(function (cell, i) { return i > 0 && context._columns[i] && context._columns[i].indexOf("__") !== 0 && cell !== null; }), function (d) { return d instanceof Array ? d[1] : d; });
        });
        switch (this.yAxisType()) {
            case "time":
                break;
            default:
                if (this.yAxisDomainLow() === "" && this.yAxisDomainHigh() === "") {
                    var valuePadding = (max - min) * this.yAxisDomainPadding() / 100;
                    var newMin = min - valuePadding;
                    if (min >= 0 && newMin < 0 || min === max)
                        newMin = 0;
                    min = newMin;
                    max = max + valuePadding;
                }
                break;
        }
        this.valueScale.domain([min, max]);

        //  Calculate Range  ---
        if (this.dataScale.rangeRoundBands) {
            this.dataScale.rangeRoundBands([isHorizontal ? 0 : this.height(), isHorizontal ? this.width() : 0], 0.1);
        } else if (this.dataScale.rangeRound) {
            this.dataScale.range([isHorizontal ? 0 : this.height(), isHorizontal ? this.width() : 0]);
        }
        this.valueScale.range([isHorizontal ? this.height() : 0, isHorizontal ? 0 : this.width()]);
        var margin = this.calcMargin(domNode, element);
        this.margin = margin;

        //  Update Range  ---
        var width = this.width() - margin.left - margin.right,
            height = this.height() - margin.top - margin.bottom,
            maxExtent = isHorizontal ? width : height,
            maxOtherExtent = isHorizontal ? height : width;

        if (this.dataScale.rangeRoundBands) {
            this.dataScale.rangeRoundBands([isHorizontal ? 0 : maxExtent, isHorizontal ? maxExtent : 0], 0.1);
        } else if (this.dataScale.rangeRound) {
            this.dataScale.range([isHorizontal ? 0 : maxExtent, isHorizontal ? maxExtent : 0]);
        }
        this.valueScale.range([isHorizontal ? maxOtherExtent : 0, isHorizontal ? 0 : maxOtherExtent]);

        //  Render  ---
        this.svg.transition()
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;

        this.svgXAxis.transition()
            .attr("class", isHorizontal ? "x axis" : "y axis")
            .attr("transform", "translate(0," + height + ")")
            .call(this.currAxis)
        ;
        this.svgXAxisText
            .attr("x", width - 2)
            .text(isHorizontal ? this.columns()[0] : this.yAxisTitle())
        ;

        this.svgYAxis.transition()
            .style("visibility", this.yAxisType() === "none" ? "hidden" : null)
            .attr("class", isHorizontal ? "y axis" : "x axis")
            .call(this.otherAxis)
        ;
        this.svgYAxisText.text(!isHorizontal ? this.columns()[0] : this.yAxisTitle());

        if (this.selectionMode()) {
            if (!this._prevBrush) {
                switch (this.xAxisType()) {
                    case "ordinal":
                        currBrush.extent([0, maxExtent]);
                        break;
                    default:
                        currBrush.extent(this.dataScale.domain());
                        break;
                }
            } else if (this._prevBrush && this._prevBrush.orientation !== this.orientation()) {
                switch (this.xAxisType()) {
                    case "ordinal":
                        currBrush.extent([maxExtent - otherBrushExtent[0] * maxExtent / this._prevBrush.maxExtent, maxExtent - otherBrushExtent[1] * maxExtent / this._prevBrush.maxExtent]);
                        break;
                    default:
                        currBrush.extent(otherBrushExtent);
                        break;
                }
            }
            this._prevBrush = {
                orientation: this.orientation(),
                maxExtent: maxExtent
            };
        }

        this.svgBrush
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .style("display", this.selectionMode() ? null : "none")
            .call(currBrush)
            .selectAll(".background").transition()
                .attr("width", width)
                .attr("height", height)
        ;

        this.svgBrush.selectAll(".extent, .resize rect").transition()
            .attr(isHorizontal ? "y" : "x", 0)
            .attr(isHorizontal ? "height" : "width", maxOtherExtent)
        ;

        var handlePath = this.svgBrush.selectAll(".resize").selectAll("path").data(function (d) { return d; });
        handlePath.enter().append("path");
        handlePath.transition()
            .attr("d", function (d) { return context.resizeBrushHandle(d, width, height); })
        ;

        this.updateChart(domNode, element, margin, width, height);
    };

    XYAxis.prototype.updateChart = function (domNode, element, margin, width, height) {
    };

    XYAxis.prototype.selection = function (selected) {
        console.log(selected);
    };

    return XYAxis;
}));



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/Scatter.js',["d3", "../common/SVGWidget", "./XYAxis", "../api/INDChart", "css!./Scatter"], factory);
    } else {
        root.chart_Column = factory(root.d3, root.common_SVGWidget, root.chart_XYAxis, root.api_INDChart);
    }
}(this, function (d3, SVGWidget, XYAxis, INDChart) {
    function Scatter(target) {
        XYAxis.call(this);
        INDChart.call(this);
    }
    Scatter.prototype = Object.create(XYAxis.prototype);
    Scatter.prototype.constructor = Scatter;
    Scatter.prototype._class += " chart_Scatter";
    Scatter.prototype.implements(INDChart.prototype);

    Scatter.prototype.publish("paletteID", "default", "set", "Palette ID", Scatter.prototype._palette.switch(),{tags:['Basic','Shared']});
    Scatter.prototype.publish("pointShape", "cross", "set", "Shape of the data points", ["circle", "rectangle", "cross"]);
    Scatter.prototype.publish("pointSize", 6, "number", "Point Size");
    Scatter.prototype.publish("interpolate", "", "set", "Interpolate Data", ["", "linear", "step", "step-before", "step-after", "basis", "bundle", "cardinal", "monotone"]);
    Scatter.prototype.publish("interpolateFill", false, "boolean", "Fill Interpolation");
    Scatter.prototype.publish("interpolateFillOpacity", 0.66, "number", "Fill Interpolation Opacity");
    Scatter.prototype.publish("useClonedPalette", false, "boolean", "Enable or disable using a cloned palette",null,{tags:['Intermediate','Shared']});

    Scatter.prototype.xPos = function (d) {
        return this.orientation() === "horizontal" ? this.dataPos(d.label) : this.valuePos(d.value);
    };

    Scatter.prototype.yPos = function (d) {
        return this.orientation() === "horizontal" ? this.valuePos(d.value) : this.dataPos(d.label);
    };

    Scatter.prototype.updateChart = function (domNode, element, margin, width, height) {
        var context = this;

        this._palette = this._palette.switch(this.paletteID());
        if (this.useClonedPalette()) {
            this._palette = this._palette.cloneNotExists(this.paletteID() + "_" + this.id());
        }

        if (this._prevPointShape !== this.pointShape()) {
            this.svgData.selectAll(".data").remove();
            this._prevPointShape = this.pointShape();
        }

        function mapShape(shape) {
            switch (shape) {
                case "rectangle":
                    return "rect";
                case "circle":
                    return "circle";
                case "cross":
                    return "path";
            }
        }

        var data = this.flattenData().map(function (d) {
            d.shape = mapShape(context.pointShape());
            return d;
        });

        var points = this.svgData.selectAll(".point").data(data, function (d, idx) { return d.shape + "_" + idx; });
        points.enter().append("g")
            .attr("class", "point")
            .on("click", function (d, idx) {
                context.click(context.rowToObj(context.data()[d.rowIdx]), context._columns[d.colIdx]);
            })
            .each(function (d) {
                var element = d3.select(this);
                element
                    .append(d.shape)
                    .append("title")
                ;
            })
        ;
        points
            .each(function (d) {
                var element = d3.select(this).select(d.shape);
                switch (d.shape) {
                    case "rect":
                        element
                            .attr("x", function (d) { return context.xPos(d) - context.pointSize() / 2; })
                            .attr("y", function (d) { return context.yPos(d) - context.pointSize() / 2; })
                            .attr("width", context.pointSize())
                            .attr("height", context.pointSize())
                            .style("fill", function (d, idx) { return context._palette(context._columns[d.colIdx]); })
                        ;
                        break;
                    case "circle":
                        element
                            .attr("cx", function (d) { return context.xPos(d); })
                            .attr("cy", function (d) { return context.yPos(d); })
                            .attr("r", context.pointSize() / 2)
                            .style("fill", function (d, idx) { return context._palette(context._columns[d.colIdx]); })
                        ;
                        break;
                    case "path":
                        element
                            .attr("d", function (d) {
                                return "M" + (context.xPos(d) - context.pointSize() / 2) + " " + (context.yPos(d) - context.pointSize() / 2) + " " +
                                    "L" + (context.xPos(d) + context.pointSize() / 2) + " " + (context.yPos(d) + context.pointSize() / 2) + " " +
                                    "M" + (context.xPos(d) - context.pointSize() / 2) + " " + (context.yPos(d) + context.pointSize() / 2) + " " +
                                    "L" + (context.xPos(d) + context.pointSize() / 2) + " " + (context.yPos(d) - context.pointSize() / 2);
                                })
                            .style("stroke", function (d, idx) { return context._palette(context._columns[d.colIdx]); })
                        ;
                        break;
                }
                element.select("title")
                    .text(function (d, idx) { return context.data()[d.rowIdx][0] + " (" + context.columns()[d.colIdx] + ")" + ": " + d.value; })
                ;

            })
        ;
        points.exit().remove();

        var areas = this.svgData.selectAll(".area").data(this.columns().filter(function (d, idx) { return context.interpolate() && context.interpolateFill() && idx > 0; }));
        areas.enter().append("path")
            .attr("class", "area")
        ;
        var area = d3.svg.area()
            .interpolate(this.interpolate())
        ;
        switch (this.orientation()) {
            case "horizontal":
                area
                    .x(function (d) { return context.xPos(d); })
                    .y0(function (d) { return height; })
                    .y1(function (d) { return context.yPos(d); })
                ;
                break;
            default:
                area
                    .y(function (d) { return context.yPos(d); })
                    .x0(function (d) { return 0; })
                    .x1(function (d) { return context.xPos(d); })
                ;
                break;
        }
        areas.each(function (d, idx) {
            var element = d3.select(this);
            element
                .attr("d", area(data.filter(function (d2) { return d2.colIdx === idx + 1; })))
                .style("opacity", context.interpolateFillOpacity())
                .style("stroke", "none")
                .style("fill", function (d, i) { return d3.hsl(context._palette(context._columns[idx + 1])).brighter(); })
            ;
        });
        areas.exit().remove();

        var lines = this.svgData.selectAll(".line").data(this.columns().filter(function (d, idx) { return context.interpolate() && idx > 0; }));
        lines.enter().append("path")
            .attr("class", "line")
        ;
        var line = d3.svg.line()
            .x(function (d) { return context.xPos(d); })
            .y(function (d) { return context.yPos(d); })
            .interpolate(this.interpolate())
        ;
        lines.each(function (d, idx) {
            var element = d3.select(this);
            var data2 = data.filter(function (d2) { return d2.colIdx === idx + 1; });
            element
                .attr("d", line(data2))
                .style("stroke", function (d, i) { return context._palette(context._columns[idx + 1]); })
                .style("fill", "none")
            ;
        });
        lines.exit().remove();
    };

    Scatter.prototype.exit = function (domNode, element) {
        SVGWidget.prototype.exit.apply(this, arguments);
    };

    return Scatter;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/Area.js',["d3", "./Scatter"], factory);
    } else {
        root.chart_Area = factory(root.d3, root.chart_Scatter);
    }
}(this, function (d3, Scatter) {
    function Area(target) {
        Scatter.call(this);

        this.interpolate("linear");
        this.interpolateFill(true);
    }
    Area.prototype = Object.create(Scatter.prototype);
    Area.prototype.constructor = Area;
    Area.prototype._class += " chart_Area";

    return Area;
}));



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/Bubble.js',["d3", "../common/SVGWidget", "../api/I2DChart", "../common/Text", "../common/FAChar", "css!./Bubble"], factory);
    } else {
        root.chart_Bubble = factory(root.d3, root.common_SVGWidget, root.api_I2DChart, root.common_Text, root.common_FAChar);
    }
}(this, function (d3, SVGWidget, I2DChart, Text, FAChar) {
    function Bubble(target) {
        SVGWidget.call(this);
        I2DChart.call(this);
        this._drawStartPos = "origin";

        this.labelWidgets = {};

        this.d3Pack = d3.layout.pack()
            .sort(function (a, b) { return a < b ? -1 : a > b ? 1 : 0; })
            .size([this.width(), this.height()])
            .value(function (d) { return d[1]; })
        ;
    }
    Bubble.prototype = Object.create(SVGWidget.prototype);
    Bubble.prototype.constructor = Bubble;
    Bubble.prototype._class += " chart_Bubble";
    Bubble.prototype.implements(I2DChart.prototype);

    Bubble.prototype.publish("paletteID", "default", "set", "Palette ID", Bubble.prototype._palette.switch(),{tags:['Basic','Shared']});
    Bubble.prototype.publish("useClonedPalette", false, "boolean", "Enable or disable using a cloned palette",null,{tags:['Intermediate','Shared']});

    Bubble.prototype.size = function (_) {
        var retVal = SVGWidget.prototype.size.apply(this, arguments);
        if (arguments.length) {
            this.d3Pack
                .size([this.width(), this.height()])
            ;
        }
        return retVal;
    };

    Bubble.prototype.update = function (domNode, element) {
        var context = this;

        this._palette = this._palette.switch(this.paletteID());
        if (this.useClonedPalette()) {
            this._palette = this._palette.cloneNotExists(this.paletteID() + "_" + this.id());
        }

        var node = element.selectAll(".node")
            .data(this._data.length ? this.d3Pack.nodes({ children: this.cloneData() }).filter(function (d) { return !d.children; }) : [], function (d) { return d[0]; })
        ;

        //  Enter  ---
        node.enter().append("g")
            .attr("class", "node")
            .attr("opacity", 0)
            .on("click", function (d) {
                context.click(context.rowToObj(d), context._columns[1]);
            })
            .each(function (d) {
                var element = d3.select(this);
                element.append("circle")
                    .attr("r", function (d) { return d.r; })
                    .append("title")
                ;
                if (d.__viz_faChar) {
                    context.labelWidgets[d[0]] = new FAChar()
                        .char(d.__viz_faChar)
                        .target(this)
                        .render()
                    ;
                } else {
                    context.labelWidgets[d[0]] = new Text()
                        .text(d[0])
                        .target(this)
                        .render()
                    ;
                }
            })
        ;

        //  Update  ---
        node.transition()
            .attr("opacity", 1)
            .each(function (d) {
                var element = d3.select(this);
                var pos = { x: d.x, y: d.y };
                element.select("circle").transition()
                    .attr("transform", function (d) { return "translate(" + pos.x + "," + pos.y + ")"; })
                    .style("fill", function (d) { return context._palette(d[0]); })
                    .attr("r", function (d) { return d.r; })
                    .select("title")
                        .text(function (d) { return d[0] + " (" + d[1] + ")"; })
                ;
                if (d.__viz_faChar) {
                    context.labelWidgets[d[0]]
                        .pos(pos)
                        .render()
                    ;
                } else {
                    var label = d[0];
                    var labelWidth = context.labelWidgets[d[0]].getBBox().width;
                    if (d.r * 2 < 16) {
                        label = "";
                    } else if (d.r * 2 < labelWidth) {
                        label = label[0] + "...";
                    }
                    context.labelWidgets[d[0]]
                        .pos(pos)
                        .text(label)
                        .render()
                    ;
                }
            })
        ;

        //  Exit  ---
        node.exit().transition()
            .style("opacity", 0)
            .remove()
        ;
    };

    return Bubble;
}));



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/Column.js',["d3", "./XYAxis", "../api/INDChart", "css!./Column"], factory);
    } else {
        root.chart_Column = factory(root.d3, root.chart_XYAxis, root.api_INDChart);
    }
}(this, function (d3, XYAxis, INDChart) {
    function Column(target) {
        XYAxis.call(this);
        INDChart.call(this);

        this._linearGap = 25;
    }
    Column.prototype = Object.create(XYAxis.prototype);
    Column.prototype.constructor = Column;
    Column.prototype._class += " chart_Column";
    Column.prototype.implements(INDChart.prototype);

    Column.prototype.publish("paletteID", "default", "set", "Palette ID", Column.prototype._palette.switch(),{tags:['Basic','Shared']});
    Column.prototype.publish("stacked", false, "boolean", "Stacked Bars");
    Column.prototype.publish("useClonedPalette", false, "boolean", "Enable or disable using a cloned palette",null,{tags:['Intermediate','Shared']});

    Column.prototype.updateChart = function (domNode, element, margin, width, height) {
        var context = this;

        this._palette = this._palette.switch(this.paletteID());
        if (this.useClonedPalette()) {
            this._palette = this._palette.cloneNotExists(this.paletteID() + "_" + this.id());
        }

        var dataLen = 10;
        var offset = 0;
        switch (this.xAxisType()) {
            case "ordinal":
                dataLen = this.dataScale.rangeBand();
                offset = 0;
                break;
            case "linear":
            case "time":
                dataLen = Math.max(Math.abs(this.dataScale(2) - this.dataScale(1)) * (100 - this._linearGap) / 100, dataLen);
                offset = -dataLen/2;
                break;
        }

        var columnScale = d3.scale.ordinal()
            .domain(context._columns.filter(function (d, idx) { return idx > 0; }))
            .rangeRoundBands([0, dataLen])
        ;

        var column = this.svgData.selectAll(".dataRow")
            .data(this.formattedData())
        ;

        column.enter().append("g")
            .attr("class", "dataRow")
        ;

        column
            .each(function (dataRow, i) {
                var element = d3.select(this);

                var columnRect = element.selectAll("rect").data(dataRow.filter(function (d, i) {return i > 0;}));

                columnRect
                  .enter().append("rect")
                    .attr("class", "columnRect")
                    .on("click", function (d, idx) {
                        context.click(context.rowToObj(dataRow), context._columns[idx + 1]);
                    })
                    .append("title")
                ;

                if (context.orientation() === "horizontal") {
                    columnRect.transition()
                        .attr("class", "columnRect")
                        .attr("x", function (d, idx) { return context.dataScale(dataRow[0]) + (context.stacked() ? 0 : columnScale(context._columns[idx + 1])) + offset;})
                        .attr("width", context.stacked() ? dataLen : columnScale.rangeBand())
                        .attr("y", function (d) { return d instanceof Array ? context.valueScale(d[1]) : context.valueScale(d) ; })
                        .attr("height", function (d) {  return  d instanceof Array ? context.valueScale(d[0]) - context.valueScale(d[1]) : height - context.valueScale(d) ; })
                        .style("fill", function (d, idx) { return context._palette(context._columns[idx + 1]); })
                    ;
                } else {
                    columnRect.transition()
                        .attr("class", "columnRect")
                        .attr("y", function (d, idx) { return context.dataScale(dataRow[0]) + (context.stacked() ? 0 : columnScale(context._columns[idx + 1])) + offset;})
                        .attr("height", context.stacked() ? dataLen : columnScale.rangeBand())
                        .attr("x", function (d) { return d instanceof Array ? context.valueScale(d[0]) : 0 ; })
                        .attr("width", function (d) {  return  d instanceof Array ? context.valueScale(d[1]) - context.valueScale(d[0]) : context.valueScale(d) ; })
                        .style("fill", function (d, idx) { return context._palette(context._columns[idx + 1]); })
                    ;
                }

                columnRect.select("title")
                    .text(function (d, idx) { return dataRow[0] + " (" + d + "," + " " + context._columns[idx + 1] + ")"; })
                ;

                if (context.stacked()) {
                    columnRect.sort(function (l, r) {
                        return r - l;
                    });
                }

                columnRect.exit().transition()
                    .remove()
                ;
        });

        column.exit().transition()
            .remove()
        ;

    };

    return Column;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/Line.js',["d3", "./Scatter"], factory);
    } else {
        root.chart_Line = factory(root.d3, root.chart_Scatter);
    }
}(this, function (d3, Scatter) {
    function Line(target) {
        Scatter.call(this);

        this.interpolate("linear");
    }
    Line.prototype = Object.create(Scatter.prototype);
    Line.prototype.constructor = Line;
    Line.prototype._class += " chart_Line";

    return Line;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/MultiChart',["d3", "../common/SVGWidget", "../api/INDChart", "require"], factory);
    } else {
        root.chart_MultiChart = factory(root.d3, root.common_SVGWidget, root.api_INDChart, root.require);
    }
}(this, function (d3, SVGWidget, INDChart, require) {
    var _1DChartTypes = [
        { id: "SUMMARY", display: "Summary", widgetClass: "chart_Summary" },
        { id: "C3_GAUGE", display: "Gauge (C3)", widgetClass: "c3chart_Gauge" }
    ];
    var _2DChartTypes = [
        { id: "BUBBLE", display: "Bubble", widgetClass: "chart_Bubble" },
        { id: "PIE", display: "Pie", widgetClass: "chart_Pie" },
        { id: "GOOGLE_PIE", display: "Pie (Google)", widgetClass: "google_Pie" },
        { id: "C3_DONUT", display: "Donut (C3)", widgetClass: "c3chart_Donut" },
        { id: "C3_PIE", display: "Pie (C3)", widgetClass: "c3chart_Pie" },
        { id: "AM_FUNNEL", display: "Area (amCharts)", widgetClass: "amchart_Funnel" },
        { id: "AM_PIE", display: "Pie (amCharts)", widgetClass: "amchart_Pie" },
        { id: "AM_PYRAMID", display: "Area (amCharts)", widgetClass: "amchart_Pyramid" },
        { id: "WORD_CLOUD", display: "Word Cloud", widgetClass: "other_WordCloud" }
    ];
    var _NDChartTypes = [
        { id: "COLUMN", display: "Column", widgetClass: "chart_Column" },
        { id: "LINE", display: "Line", widgetClass: "chart_Line" },
        { id: "AREA", display: "Area", widgetClass: "chart_Area" },
        { id: "STEP", display: "Step", widgetClass: "chart_Step" },
        { id: "GOOGLE_BAR", display: "Bar (Google)", widgetClass: "google_Bar" },
        { id: "GOOGLE_COLUMN", display: "Column (Google)", widgetClass: "google_Column" },
        { id: "GOOGLE_LINE", display: "Line (Google)", widgetClass: "google_Line" },
        { id: "C3_AREA", display: "Area (C3)", widgetClass: "c3chart_Area" },
        { id: "C3_BAR", display: "Bar (C3)", widgetClass: "c3chart_Bar" },
        { id: "C3_COLUMN", display: "Column (C3)", widgetClass: "c3chart_Column" },
        { id: "C3_LINE", display: "Line (C3)", widgetClass: "c3chart_Line" },
        { id: "C3_SCATTER", display: "Scatter (C3)", widgetClass: "c3chart_Scatter" },
        { id: "C3_STEP", display: "Step (C3)", widgetClass: "c3chart_Step" },
        { id: "AM_AREA", display: "Area (amCharts)", widgetClass: "amchart_Area" },
        { id: "AM_BAR", display: "Bar (amCharts)", widgetClass: "amchart_Bar" },
        { id: "AM_LINE", display: "Line (amCharts)", widgetClass: "amchart_Line" },
        //{ id: "AM_SCATTER", display: "Scatter (amCharts)", widgetClass: "amchart_Scatter" },
    ];
    var _anyChartTypes = [
        { id: "TABLE", display: "Table", widgetClass: "other_Table" }
    ];
    var _allChartTypes = _1DChartTypes.concat(_2DChartTypes.concat(_NDChartTypes.concat(_anyChartTypes)));

    function MultiChart() {
        SVGWidget.call(this);
        INDChart.call(this);

        this.chart(null);

        this._1DChartTypes = _1DChartTypes;
        this._2DChartTypes = _2DChartTypes;
        this._NDChartTypes = _NDChartTypes;
        this._anyChartTypes = _anyChartTypes;
        this._allChartTypes = _allChartTypes;

        this._allCharts = {};
        this._allChartTypes.forEach(function (item) {
            var newItem = JSON.parse(JSON.stringify(item));
            newItem.widget = null;
            this._allCharts[item.id] = newItem;
            this._allCharts[item.display] = newItem;
            this._allCharts[item.widgetClass] = newItem;
        }, this);
        //  Backward compatability until we roll our own BAR  ---
        this._allCharts["BAR"] = this._allCharts["COLUMN"];
    }
    MultiChart.prototype = Object.create(SVGWidget.prototype);
    MultiChart.prototype.constructor = MultiChart;
    MultiChart.prototype._class += " chart_MultiChart";
    MultiChart.prototype.implements(INDChart.prototype);

    MultiChart.prototype.publish("chartType", "BUBBLE", "set", "Chart Type", _allChartTypes.map(function (item) { return item.id; }),{tags:['Basic']});
    MultiChart.prototype.publish("chart", null, "widget", "Chart",null,{tags:['Basic']});

    MultiChart.prototype.columns = function (_) {
        var retVal = SVGWidget.prototype.columns.apply(this, arguments);
        if (arguments.length && this.chart()) {
            this.chart().columns(_);
        }
        return retVal;
    };

    MultiChart.prototype.data = function (_) {
        var retVal = SVGWidget.prototype.data.apply(this, arguments);
        if (arguments.length && this.chart()) {
            this.chart().data(_);
        }
        return retVal;
    };

    MultiChart.prototype.hasOverlay = function () {
        return this.chart() && this.chart().hasOverlay();
    };

    MultiChart.prototype.visible = function (_) {
        if (!arguments.length) return this.chart() && this.chart().visible();
        if (this.chart()) {
            this.chart().visible(_);
        }
        return this;
    };

    MultiChart.prototype.requireContent = function (chartType, callback) {
        var retVal = this._allCharts[chartType].widget;
        if (retVal) {
            callback(retVal);
            return;
        }

        var context = this;
        var path = "src/" + this._allCharts[chartType].widgetClass.split("_").join("/");
        require([path], function (WidgetClass) {
            retVal = new WidgetClass();
            context._allCharts[chartType].widget = retVal;
            callback(retVal);
        });
    };

    MultiChart.prototype.switchChart = function (callback) {
        var oldContent = this.chart();
        var context = this;
        this.requireContent(this.chartType(), function (newContent) {
            if (newContent !== oldContent) {
                var size = context.size();
                newContent
                    .columns(context._columns)
                    .data(context._data)
                    .size(size)
                ;
                context.chart(newContent);
                newContent.click = function (row, column) {
                    context.click(row, column);
                };
                if (oldContent) {
                    oldContent
                        .data([])
                        .size({ width: 1, height: 1 })
                        .render()
                    ;
                }
            }
            if (callback) {
                callback(this);
            }
        });
    };

    MultiChart.prototype.update = function (domNode, element) {
        SVGWidget.prototype.update.apply(this, arguments);
        var content = element.selectAll(".multiChart").data(this.chart() ? [this.chart()] : [], function (d) { return d._id; });
        content.enter().append("g")
            .attr("class", "multiChart")
            .each(function (d) {
                d.target(this);
            })
        ;

        var size = this.size();
        content
            .each(function (d) {
                d
                    .size(size)
                    .render()
                ;
            })
        ;

        content.exit().transition()
            .each(function (d) { d.target(null); })
            .remove()
        ;
    };

    MultiChart.prototype.exit = function (domNode, element) {
        if (this.chart()) {
            this.chart().target(null);
        }
        SVGWidget.prototype.exit.apply(this, arguments);
    };


    MultiChart.prototype.render = function (callback) {
        if (this.chartType() && (!this.chart() || (this.chart().classID() !== this._allCharts[this.chartType()].widgetClass))) {
            var context = this;
            var args = arguments;
            this.switchChart(function () {
                SVGWidget.prototype.render.apply(context, args);
            });
            return this;
        }
        return SVGWidget.prototype.render.apply(this, arguments);
    };

    return MultiChart;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/MultiChartSurface.js',["d3", "../common/ResizeSurface", "./MultiChart", "../api/INDChart"], factory);
    } else {
        root.chart_MultiChartSurface = factory(root.d3, root.common_ResizeSurface, root.chart_MultiChart, root.api_INDChart);
    }
}(this, function (d3, ResizeSurface, MultiChart, INDChart) {
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
        this.content(this._content);
        this.mode("all");
    }
    MultiChartSurface.prototype = Object.create(ResizeSurface.prototype);
    MultiChartSurface.prototype.constructor = MultiChartSurface;
    MultiChartSurface.prototype._class += " chart_MultiChartSurface";
    MultiChartSurface.prototype.implements(INDChart.prototype);

    MultiChartSurface.prototype.testData = INDChart.prototype.testData;

    MultiChartSurface.prototype.publish("mode", "2D", "set", "Chart Type", ["1D", "2D", "ND", "all"]);
    MultiChartSurface.prototype.publishProxy("chartType", "_content");

    MultiChartSurface.prototype.columns = function (_) {
        if (!arguments.length) return this.content().columns();
        this.content().columns(_);
        return this;
    };

    MultiChartSurface.prototype.data = function (_) {
        if (!arguments.length) return this.content().data();
        this.content().data(_);
        return this;
    };

    MultiChartSurface.prototype._modeOrig = MultiChartSurface.prototype.mode;
    MultiChartSurface.prototype.mode = function (_) {
        var retVal = MultiChartSurface.prototype._modeOrig.apply(this, arguments);
        if (arguments.length) {
            this._mode = _;
            switch (this._mode) {
                case "1d":
                case "1D":
                    this.menu(this.content()._1DChartTypes.map(function (item) { return item.display; }).sort());
                    break;
                case "2d":
                case "2D":
                    this.menu(this.content()._2DChartTypes.concat(this.content()._NDChartTypes.concat(this.content()._anyChartTypes)).map(function (item) { return item.display; }).sort());
                    break;
                case "multi":
                    /* falls through */
                case "ND":
                    this.menu(this.content()._NDChartTypes.concat(this.content()._anyChartTypes).map(function (item) { return item.display; }).sort());
                    break;
                case "all":
                    /* falls through */
                default:
                    this.menu(this.content()._allChartTypes.map(function (item) { return item.display; }).sort());
            }
        }
        return retVal;
    };

    return MultiChartSurface;
}));



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/Pie.js',["d3", "../common/SVGWidget", "../api/I2DChart", "../common/Text", "../common/FAChar", "css!./Pie"], factory);
    } else {
        root.chart_Pie = factory(root.d3, root.common_SVGWidget, root.api_I2DChart, root.common_Text, root.common_FAChar);
    }
}(this, function (d3, SVGWidget, I2DChart, Text, FAChar) {
    function Pie(target) {
        SVGWidget.call(this);
        I2DChart.call(this);

        this._outerText = false;  //  Put label inside pie or outside (true/false)
        this._radius = 100;       // px
        this._innerRadius = 0;    // px

        this.labelWidgets = {};

        this.d3Pie = d3.layout.pie()
            .sort(function (a, b) {
                return a < b ? -1 : a > b ? 1 : 0;
            })
            .value(function (d) { return d[1]; })
        ;
        this.d3Arc = d3.svg.arc()
            .outerRadius(this._radius)
            .innerRadius(this._innerRadius)
        ;
    }
    Pie.prototype = Object.create(SVGWidget.prototype);
    Pie.prototype.constructor = Pie;
    Pie.prototype._class += " chart_Pie";
    Pie.prototype.implements(I2DChart.prototype);

    Pie.prototype.publish("paletteID", "default", "set", "Palette ID", Pie.prototype._palette.switch(),{tags:['Basic','Shared']});
    Pie.prototype.publish("useClonedPalette", false, "boolean", "Enable or disable using a cloned palette",null,{tags:['Intermediate','Shared']});

    Pie.prototype.size = function (_) {
        var retVal = SVGWidget.prototype.size.apply(this, arguments);
        if (arguments.length) {
            this.radius(Math.min(this._size.width, this._size.height) / 2);
        }
        return retVal;
    };

    Pie.prototype.radius = function (_) {
        if (!arguments.length) return this._radius;
        this.d3Arc.outerRadius(_);
        this._radius = _;
        return this;
    };

    Pie.prototype.innerRadius = function (_) {
        if (!arguments.length) return this._innerRadius;
        this.d3Arc.innerRadius(_);
        this._innerRadius = _;
        return this;
    };

    Pie.prototype.outerText = function (_) {
        if (!arguments.length) return this._outerText;
        this._outerText = _;
        return this;
    };

    Pie.prototype.intersection = function (pointA, pointB) {
        return this.intersectCircle(pointA, pointB);
    };

    Pie.prototype.update = function (domNode, element) {
        var context = this;

        this._palette = this._palette.switch(this.paletteID());
        if (this.useClonedPalette()) {
            this._palette = this._palette.cloneNotExists(this.paletteID() + "_" + this.id());
        }

        var arc = element.selectAll(".arc").data(this.d3Pie(this._data), function (d) { return d.data[0]; });

        //  Enter  ---
        arc.enter().append("g")
            .attr("class", "arc")
            .attr("opacity", 0)
            .on("click", function (d) {
                context.click(context.rowToObj(d.data), context._columns[1]);
            })
            .each(function (d) {
                var element = d3.select(this);
                element.append("path")
                    .attr("d", context.d3Arc)
                    .append("title")
                ;
                if (d.data.__viz_faChar) {
                    context.labelWidgets[d.data[0]] = new FAChar()
                        .char(d.data.__viz_faChar)
                        .target(this)
                        .render()
                    ;
                } else {
                    context.labelWidgets[d.data[0]] = new Text()
                        .text(d.data[0])
                        .target(this)
                        .render()
                    ;
                }
            })
        ;

        //  Update  ---
        arc.transition()
            .attr("opacity", 1)
            .each(function (d) {
                var pos = { x: 0, y: 1 };
                if (context._outerText) {
                    var xFactor = Math.cos((d.startAngle + d.endAngle - Math.PI) / 2);
                    var yFactor = Math.sin((d.startAngle + d.endAngle - Math.PI) / 2);

                    var textBBox = context.labelWidgets[d.data[0]].getBBox();
                    var textOffset = Math.abs(xFactor) > Math.abs(yFactor) ? textBBox.width : textBBox.height;
                    pos.x = xFactor * (context._radius + textOffset);
                    pos.y = yFactor * (context._radius + textOffset);
                } else {
                    var centroid = context.d3Arc.centroid(d);
                    pos = { x: centroid[0], y: centroid[1] };
                }

                var element = d3.select(this);
                element.select("path").transition()
                    .attr("d", context.d3Arc)
                    .style("fill", function (d) { return context._palette(d.data[0]); })
                    .select("title")
                        .text(function (d) { return d.data[0] + " (" + d.data[1] + ")"; })
                ;
                context.labelWidgets[d.data[0]]
                    .pos(pos)
                    .render()
                    .element()
                        .classed("innerLabel", !context._outerText)
                        .classed("outerLabel", context._outerText)
                ;
            })
        ;

        //  Exit  ---
        arc.exit().transition()
            .style("opacity", 0)
            .remove()
        ;

        //  Label Lines  ---
        if (context._outerText) {
            var lines = element.selectAll("line").data(this.d3Pie(this._data), function (d) { return d.data[0]; });
            lines.enter().append("line")
              .attr("x1", 0)
              .attr("x2", 0)
              .attr("y1", -this._radius - 3)
              .attr("y2", -this._radius - 8)
              .attr("stroke", "gray")
              .attr("transform", function (d) {
                  return "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")";
              });
            lines.transition()
              .attr("transform", function (d) {
                  return "rotate(" + (d.startAngle + d.endAngle) / 2 * (180 / Math.PI) + ")";
              });
            lines.exit().remove();
        }
    };

    return Pie;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/Step.js',["d3", "./Scatter"], factory);
    } else {
        root.chart_Step = factory(root.d3, root.chart_Scatter);
    }
}(this, function (d3, Scatter) {
    function Step(target) {
        Scatter.call(this);

        this.interpolate("step");
    }
    Step.prototype = Object.create(Scatter.prototype);
    Step.prototype.constructor = Step;
    Step.prototype._class += " chart_Step";

    return Step;
}));




(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('chart/Summary.js',["d3", "../common/HTMLWidget", "../api/I1DChart", "css!font-awesome", "css!./Summary"], factory);
    } else {
        root.chart_Summary = factory(root.d3, root.common_HTMLWidget, root.api_I1DChart);
    }
}(this, function (d3, HTMLWidget, I1DChart) {
    function Summary() {
        HTMLWidget.call(this);
        this._tag = "div";

        this._drawStartPos = "center";

    }
    Summary.prototype = Object.create(HTMLWidget.prototype);
    Summary.prototype.constructor = Summary;
    Summary.prototype.implements(I1DChart.prototype);
    Summary.prototype._class += " chart_Summary";

    Summary.prototype.publish("colorFill", "#3498db", "html-color", "Fill Color", null);
    Summary.prototype.publish("colorStroke", "#ffffff", "html-color", "Fill Color", null);
    Summary.prototype.publish("valueIcon", "fa-briefcase", "string", "FA Char icon class");
    Summary.prototype.publish("moreText", "More Info", "string", "'More' text");
    Summary.prototype.publish("moreIcon", "fa-info-circle", "string", "FA Char icon class");
    Summary.prototype.publish("fixedSize", true, "boolean", "Fix Size to Min Width/Height");
    Summary.prototype.publish("minWidth", 225, "number", "Minimum Width");
    Summary.prototype.publish("minHeight", 150, "number", "Minimum Height");

    Summary.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        this._mainDiv = element.append("div")
        ;
        var context = this;
        this._headerDiv = this._mainDiv.append("h2")
            .on("click", function (d) {
                var clickEvent = {};
                clickEvent[context.columns()] = context.data();
                context.click(clickEvent, "value");
            })
        ;
        this._textDiv = this._mainDiv.append("div")
            .attr("class", "text")
            .on("click", function (d) {
                var clickEvent = {};
                clickEvent[context.columns()] = context.data();
                context.click(clickEvent, "text");
            })
        ;
    };

    Summary.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        element
            .style({
                width: this.fixedSize() ? this.minWidth() + "px" : "100%",
                height: this.fixedSize() ? this.minHeight() + "px" : "100%"
            })
        ;
        this._mainDiv
            .attr("class", "content bgIcon " + this.valueIcon())
            .style({
                "background-color": this.colorFill(),
                "color": this.colorStroke(),
                "min-width": this.minWidth() + "px",
                "min-height": this.minHeight() + "px"
            })
        ;
        this._headerDiv
            .style("color", this.colorStroke())
            .text(this.data())
        ;
        this._textDiv
            .text(this.columns())
        ;
        var context = this;
        var moreDivs = this._mainDiv.selectAll(".more").data(this.moreText() ? [this.moreText()] : []);
        moreDivs.enter()
            .append("div")
            .attr("class", "more")
            .on("click", function (d) {
                var clickEvent = {};
                clickEvent[context.columns()] = context.data();
                context.click(clickEvent, "more");
            })
            .each(function (d) {
                var element = d3.select(this);
                element.append("i");
                element.append("span");
            })
        ;
        moreDivs
            .attr("style", "background-color:" + d3.rgb(this.colorFill()).darker(0.75))
        ;
        moreDivs.select("i")
            .attr("class", "fa " + this.moreIcon())
        ;
        moreDivs.select("span")
            .text(this.moreText())
        ;
        moreDivs.exit().remove();
    };

    Summary.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    return Summary;
}));

