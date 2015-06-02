var gg;
"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "dimple"], factory);
    } else {
        root.dimple_Common = factory(root.d3, root.common_HTMLWidget, root.dimple);
    }
}(this, function (d3, HTMLWidget, dimple) {

    function Common(tget) {
        HTMLWidget.call(this);

        this._tag = "div";

        this.columns([]);
        //this.data([],{tags:['Advanced']});

        //this._data_google = [];

        this._chart = null;
        this._svg = null;
    }
    Common.prototype = Object.create(HTMLWidget.prototype);
    Common.prototype._class += " dimple_Common";

    /**
     * Publish Params Common To Other Libraries
     */
    Common.prototype.publish("fontSize", null, "number", "Font Size",null,{tags:['Basic','Shared']});
    Common.prototype.publish("fontFamily", null, "string", "Font Name",null,{tags:['Basic','Shared']});
    Common.prototype.publish("fontColor", null, "html-color", "Font Color",null,{tags:['Basic','Shared']});

    Common.prototype.publish("showLegend", false, "boolean", "Show Legend",null,{tags:['Basic','Shared']});

    // below ones are TODO ... BOLD/ITALTIC needs to be 1 param maybe?
    Common.prototype.publish("legendFontColor", null, "html-color", "Legend Font Color",null,{tags:['Private']});
    Common.prototype.publish("legendFontFamily", null, "string", "Legend Font Name",null,{tags:['Private']});
    Common.prototype.publish("legendFontSize", null, "number", "Legend Font Size",null,{tags:['Private']});
    Common.prototype.publish("legendFontBold", false, "boolean", "Legend Font Bold",null,{tags:['Private']});
    Common.prototype.publish("legendFontItalic", false, "boolean", "Legend Font Italic",null,{tags:['Private']});

    /**
     * Publish Params Unique To This Widget
     */
    Common.prototype.publish("chartAreaWidth", null, "string", "Chart Area Width",null,{tags:['Advanced']}); // num or string
    Common.prototype.publish("chartAreaHeight", null, "string", "Chart Area Height",null,{tags:['Advanced']});
    Common.prototype.publish("chartAreaTop", null, "string", "Chart Area Distance From Top",null,{tags:['Advanced']}); // num or string (google default auto)
    Common.prototype.publish("chartAreaLeft", null, "string", "Chart Area Distance From Left",null,{tags:['Advanced']});

    //TODO: Remove the legend params ... above shared params????
    Common.prototype.publish("legendAlignment", "center", "set", "Legend Alignment", ["", "start", "center", "end"],{tags:['Private']});
    Common.prototype.publish("legendPosition", "right", "set", "Legend Position", ["", "bottom", "labeled", "left", "right", "top"],{tags:['Private']});

    //TODO:Do these apply to animating between data sets?
    Common.prototype.publish("animationDuration", 0, "number", "Animation Duration",null,{tags:['Advanced']});
    Common.prototype.publish("animationOnStartup", true, "boolean", "Animate On Startup",null,{tags:['Advanced']});
    Common.prototype.publish("animationEasing", "linear", "set", "Animation Easing", ["linear", "in", "out", "inAndOut"],{tags:['Advanced']});

    Common.prototype.publish("title", "", "string", "Text To Display Above The Chart",null,{tags:['Private']});
    Common.prototype.publish("titlePosition", "out", "set", "Position of Title",["in","out","none"],{tags:['Private']});

    // need to see if this is going to be shared these 3 below
    Common.prototype.publish("backgroundColorStroke", null, "html-color", "Background Border Color",null,{tags:['Advanced','Shared']});
    Common.prototype.publish("backgroundColorStrokeWidth", 0, "number", "Background Border Width",null,{tags:['Advanced','Shared']});
    Common.prototype.publish("backgroundColorFill", "transparent", "html-color", "Background Color",null,{tags:['Advanced','Shared']});

//    Common.prototype.data = function (_) {
//        var retVal = HTMLWidget.prototype.data.apply(this, arguments);
//        if (arguments.length) {
//            // var data = null;
//            // if (this._data.length) {
//            //     data = [this._columns].concat(this._data);
//            // } else {
//            //     data = [
//            //         ['', { role: 'annotation' }],
//            //         ['', '']
//            //     ];
//            // }
//            // this._data_google = google.visualization.arrayToDataTable(data);
//        }
//        return retVal;
//    };

    Common.prototype.getChartOptions = function () {
        // var colors = this._columns.filter(function (d, i) { return i > 0; }).map(function (row) {
        //     return this._palette(row);
        // }, this);

        var chartOptions =  {
            // TODO
        };
        return chartOptions;
    };

    Common.prototype.enter = function (domNode, element) {
        element.style("overflow", "hidden");
        this.svg = dimple.newSvg(domNode, this.width(), this.height());
    };

    Common.prototype.update = function(domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
            //console.log(this._data);
        var dataArr = [];
        var context = this;
        var data = this.data();
        var cols = this.columns();
        for(var i in data){
            var row = data[i];
            for(var j in row){
                if(j > 0){
                    var obj = {};
                    obj[cols[0]] = row[0];
                    obj[cols[j]] = row[j];

                    obj['Value'] = row[j];
                    obj['Link'] = cols[j];
                    dataArr.push(obj);
                }
            }
        }
//        for(var i in data){
//            var obj = {};
//            var row = data[i];
//            for(var j in row){
//                obj[cols[j]] = row[j];
//            }
//            dataArr.push(obj);
//        }


        console.log(dataArr);



        this.chart = new dimple.chart(this.svg, dataArr);
        this.updateChartOptions();
        this.chart.draw();
    };

    return Common;
}));
