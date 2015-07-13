"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "../layout/Surface", "../chart/Pie", "../chart/MultiChart", "../google/Line", "css!./TabbedContent"], factory);
    } else {
        root.form_Form = factory(root.d3, root.common_HTMLWidget, root.layout_Surface, root.chart_Pie, root.chart_MultiChart, root.chart_Line);
    }
}(this, function (d3, HTMLWidget, Surface, Pie, MultiChart, Line) {
    function TabbedContent() {
        HTMLWidget.call(this);

        this._tag = "div";
        this._tabButtons = [];
        this._tabAnnotations = [];
    }
    TabbedContent.prototype = Object.create(HTMLWidget.prototype);
    TabbedContent.prototype._class += " layout_TabbedContent";

    TabbedContent.prototype.publish("groupClass", "", "string", "Class to identify all elements in this tab grouping",null,{});
//    TabbedContent.prototype.publish("tabAnnotations", null, "array", "Tab Array",null,{});
    TabbedContent.prototype.publish("widgets", [], "widgetArray", "widgets",null,{tags:['Private']});

    TabbedContent.prototype.testData = function () {
        this.groupClass("tabTest");
        this
            .addTab(new Surface().widget(new MultiChart().testData()), "tab_1", "MultiChart", "active" )
            .addTab(new Surface().widget(new Pie().testData()), "tab_2", "Pie Chart", "")
            .addTab(new Surface().widget(new Line().testData()), "tab_3", "Line Chart", "")
        ;

        return this;
    };

    TabbedContent.prototype.addTab = function(widget, id, label, clss) {
        if (id === "" || id === undefined) {
            throw "Tab must have a valid id";
        }
        if (!widget) {
            throw "No widget defined for tab";
        }
        clss = clss || "";
        if (!this._tabAnnotations) {
            this._tabAnnotations = [];
        }

        this._tabAnnotations.push({"id":id, "label":label, "clss":clss, "widget":widget});
        this.widgets().push(widget);

        return this;
    };

    TabbedContent.prototype.widgetSize = function (widgetDiv) {
        var width = this.clientWidth() - this.calcFrameWidth(widgetDiv);
        var height = this.clientHeight() - this.calcFrameHeight(widgetDiv);

        return { width: width, height: height };
    };

    TabbedContent.prototype.createContainers = function (element) {
        element.classed(this.groupClass(), true);
        var context = this;

//        if (!this._tabContainer) {
            var tabs = this._tabContainer.selectAll(".tab-button").data(this._tabAnnotations);
//        }

        tabs.enter().append("span").classed("tab-button",true)
            .each(function (tab, idx) {

                var el = context._tabButtons[idx] = d3.select(this)
                    .attr("class", "tab-button " + tab.clss)
                    //.attr("for", tab.id)
                    .style("cursor","pointer")
                    .html(function() { return tab.label; })
                    .on("click", function() {
                        var cls = context.groupClass() === "" ? "" : "." + context.groupClass() + " ";
                        element.selectAll(cls + ".tab-button")
                            .classed("active", false);
                        el.classed("active", true);
                        element.selectAll(cls + ".tab-content")
                            .style("display", "none")
                            .classed("active", false);
                        element.select(".tab-content-"+idx)
                            .style("display", "block")
                            .classed("active", true);
                    })
                ;


            }
        );

        tabs.exit().remove();


//        if (!this._contentContainer) {
        var content = this._contentContainer.selectAll(".tab-content").data(this._tabAnnotations);
//        }
        content.enter().append("div")
            .each(function (tab, idx) {
                var el = context._tabButtons[idx] = d3.select(this)
                    .attr("class", "tab-content tab-content-"+idx)
                    .style("display", "none")
                ;
                if (tab.clss.indexOf("active") > -1) {
                    el.style("display", "block");
                    el.classed("active", true);
                }
                el
                    .style('width', context.widgetSize(el).width + "px")
                    .style('height', context.widgetSize(el).height + "px")
                ;
                //tab.widget.target(this).render();
                if (!context.widgets()[idx].target()) {
                    context.widgets()[idx].target(this)
                }
                //context.widgets()[idx].target(this).render();
                context.widgets()[idx].render();
            }
        );

        content.exit().remove();
    };

    TabbedContent.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        this._tabContainer = element.append("div").attr("class", "tabContainer");
        this._contentContainer = element.append("div").attr("class", "contentContainer")
    };

    TabbedContent.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        this.createContainers(element);
    };

    return TabbedContent;
}));