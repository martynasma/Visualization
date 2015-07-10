"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "../form/Input", "./Cell", "../common/Text", "../common/Icon", "../chart/Pie", "./Surface", "css!./Toolbar"], factory);
    } else {
        root.common_Toolbar = factory(root.d3, root.common_HTMLWidget, root.form_Input, root.layout_Cell, root.common_Text, root.common_Icon);
    }
}(this, function (d3, HTMLWidget, formInput, Cell, Text, Icon, Pie, Surface) {
    function Toolbar() {
        HTMLWidget.call(this);

        this._tag = "div";
        this._widgetArr = [];

    }
    Toolbar.prototype = Object.create(HTMLWidget.prototype);
    Toolbar.prototype._class += " layout_Toolbar";

    Toolbar.prototype.publish("title", "", "string", "Title",null,{tags:['basic']});
    Toolbar.prototype.publish("gutter", 4, "number", "Gap Between Widgets",null,{tags:['Private']});

    Toolbar.prototype.toolbarAnnotations = function(_){
        if (!arguments.length) { return this._tabAnnotations; }
        this._tabAnnotations = _;
        return this;
    }

    Toolbar.prototype.testData = function () {
        this.toolbarAnnotations([
            {
                widget: new formInput().type("button").value("button 1").label("button 1").name("button1")
            },
            {
                widget: new formInput().type("button").value("button 2").label("button 2").name("button2")
            },
            {
               widget: new Icon().testData().diameter(20)
               // widget: new Icon().testData().shape("square")
            }
        ]);
        return this;
    };

    Toolbar.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        //this._toolbarContainer = element.append("div").attr("class", "toolbar-container");
        this._toolbarContainer = element;
    };

    Toolbar.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        var context = this;

        this._toolbarContainer
            //.style("width",this.width()+"px")
            .style("height",25+"px")
            .style("border-width",1+'px')
            .style("border-color","#ffa500")
            .style("border-style","solid")
            .style("border-radius",0+'px')
            .style("background-color","#FFFFFF")
        ;


        var widgets = this._toolbarContainer.selectAll(".toolbar-widget").data(this.toolbarAnnotations());

        widgets.enter().append("div")
            .attr("class", "toolbar-widget")
            .each(function (obj, idx) {
//                d3.select(this).style("width",obj.width+"px");
//                d3.select(this).style("height",obj.height+"px");
                d3.select(this).style("width",50+"px");
                d3.select(this).style("height",50+"px");
                var abc = obj.widget.target(this).render();
                //g_arr.push(abc);










                //new Surface().target(this).width(100).height(100).widget(obj.widget).render();
            })
        ;
        //this.resize();
    };

    Toolbar.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    return Toolbar;
}));
