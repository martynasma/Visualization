"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "./Cell", "../common/Text", "../chart/Pie", "../chart/MultiChart", "../c3chart/Line", "../common/Icon", "../form/Input", "css!./Grid"], factory);
    } else {
        root.layout_Grid = factory(root.d3, root.common_HTMLWidget, root.layout_Cell, root.common_Text, root.chart_Pie, root.chart_MultiChart, root.c3chart_Line, root.common_Icon, root.form_Input);
    }
}(this, function (d3, HTMLWidget, Cell, Text, Pie, MultiChart, Line, Icon, Input) {
    function Grid() {
        HTMLWidget.call(this);

        this._tag = "div";

//        this._colCount = 0;
//        this._rowCount = 0;
//        this._colSize = 0;
//        this._rowSize = 0;

        this.content([]);
    }
    Grid.prototype = Object.create(HTMLWidget.prototype);
    Grid.prototype._class += " layout_Grid";

    Grid.prototype.publish("designMode", false, "boolean", "Design Mode",null,{tags:['Private']});
    Grid.prototype.publish("gutter", 4, "number", "Gap Between Widgets",null,{tags:['Private']});
    Grid.prototype.publish("fitTo", "all", "set", "Sizing Strategy", ["all", "width"], { tags: ['Private'] });

    Grid.prototype.publish("cellPadding", null, "string", "Cell Padding (px)", null, { tags: ['Intermediate'] });

    Grid.prototype.publish("content", [], "widgetArray", "widgets",null,{tags:['Private']});

    Grid.prototype.testData = function () {

        var opts = {
            width:20,
            height:20,
            surfacePadding:0
        };

        this
            .setContent(0, new Icon().testData().diameter(20), null, null, opts)
//            //.setContent(0, 1, new Icon().testData().size({width:20,height:20}))
//            .setContent(1, 1, new Pie().testData())
//            .setContent(0, 0, new Pie().testData())
            //.setContent(1, new Pie().testData(), null, null, opts)
            .setContent(2,
                    new Input()
                    .name("button-test")
                    .label("Button Test")
                    .type("button")
                    .value("Button Text"),
                    null,null, {
            width:40,
            height:20,
            surfacePadding:0
                    })




//            .setContent(1, 0, new Pie().testData())
//            .setContent(1, 1, new Pie().testData())
//            .setContent(0, 2, new MultiChart().testData(), "Title AAA", 2, 2)
//            .setContent(2, 0, new Line().testData(), "Title BBB", 2, 4)
        ;
        return this;
    };

    Grid.prototype.getDimensions = function () {
        var size = { width: 0, height: 0 };
        this.content().forEach(function (cell) {
            if (size.width < cell.gridCol() + cell.gridColSpan()) {
                size.width = cell.gridCol() + cell.gridColSpan();
            }
            if (size.height < cell.gridRow() + cell.gridRowSpan()) {
                size.height = cell.gridRow() + cell.gridRowSpan();
            }
        }, this);
        return size;
    };

    Grid.prototype.clearContent = function () {
        this.content(this.content().filter(function (contentWidget) {
            contentWidget.target(null);
            return false;
        }));
    };

    Grid.prototype.setContent = function (col, widget, title, colSpan, options) {
        var rowSpan = 1;
        var row = 0;
        colSpan = colSpan || 1;
        title = title || "";
        this.content(this.content().filter(function (contentWidget) {
            if (contentWidget.gridRow() === row && contentWidget.gridCol() === col) {
                contentWidget.target(null);
                return false;
            }
            return true;
        }));
        //this.cellPadding(0);
        if (widget) {
            var cell = new Cell()
                .gridRow(row)
                .gridCol(col)
                .widget(widget)
                .title(title)
                .gridRowSpan(rowSpan)
                .gridColSpan(colSpan)

                .surfacePadding(options.surfacePadding)

                //.cellPadding(0)
                .surfaceBorderWidth(0)

                .width(options.width)
                .height(options.height)
            ;
            this.content().push(cell);
        }
        return this;
    };

    Grid.prototype.getCell = function (row, col) {
        var retVal = null;
        this.content().some(function (cell) {
            if (row >= cell.gridRow() && row < cell.gridRow() + cell.gridRowSpan() &&
                col >= cell.gridCol() && col < cell.gridCol() + cell.gridColSpan()) {
                retVal = cell;
                return true;
            }
            return false;
        });
        return retVal;
    };

    Grid.prototype.getContent = function (id) {
        var retVal = null;
        this.content().some(function (cell) {
            if (cell.widget()._id === id) {
                retVal = cell.widget();
                return true;
            }
            return false;
        });
        return retVal;
    };

    Grid.prototype.childMoved = Grid.prototype.debounce(function (domNode, element) {
        this.render();
    }, 250);

    Grid.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        element.style("position", "relative");
        //this.dropDiv = element.append("div");
        this.contentDiv = element.append("div");
        //this._scrollBarWidth = this.getScrollbarWidth();
    };

    Grid.prototype.findCurrentLocation = function (e) {
        this._currLoc = [
            Math.floor((e.clientX - this._offsetX)/this._colSize),
            Math.floor((e.clientY - this._offsetY)/this._rowSize)
        ];
    };

    Grid.prototype.setGridOffsets = function () {
        this._offsetX = this._element.node().getBoundingClientRect().left + (this.gutter()/2);
        this._offsetY = this._element.node().getBoundingClientRect().top + (this.gutter()/2);
    };

    Grid.prototype.updateCells = function (cellWidth, cellHeight) {
        var context = this;
        var rows = this.contentDiv.selectAll(".cell_" + this._id).data(this.content(), function (d) { return d._id; });
        rows.enter().append("div")
            .attr("class", "cell_" + this._id)
            .style("position", "absolute")
            .each(function (d) {
                d
                   .target(this)
                ;
                d.__grid_watch = d.watch(function (key, newVal, oldVal) {
                    if (context._renderCount && key.indexOf("grid") === 0 && newVal !== oldVal) {
                        context.childMoved();
                    }
                });
            });

        //this.contentDiv.selectAll(".cell_" + this._id).on(".drag", null);
        //this.cellPadding(0)
        var padding = 5;
        rows
            .style("left", function (d,i ) { alert(d.gridCol() * d.width() + (i>0?(context.gutter() / 2):0) + padding + "px"); return d.gridCol() * d.width() + (i>0?(context.gutter() / 2):0) + padding + "px"; })
            //.style("left", function (d,i ) { return d.gridCol() * d.width() + context.gutter() / 2 + "px"; })
            .style("top", function (d) { return d.gridRow() * d.height() + context.gutter() / 2 + "px"; })
            .style("width", function (d) { return d.gridColSpan() * d.width() + "px"; })
            .style("height", function (d) { return d.gridRowSpan() * d.height() + "px"; })
            .each(function (d) {
                d
                    //.surfacePadding(context.cellPadding())
                    .resize()
                ;
            });
        rows.exit().each(function (d) {
            d
               .target(null)
            ;
            if (d.__grid_watch) {
                d.__grid_watch.remove();
            }
        }).remove();
    };

    Grid.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);

        this.contentDiv
            .style("width",this.width())
            .style("height","20px")
            .style("border-width",1+'px')
            .style("border-color","#ffa500")
            .style("border-style","solid")
            .style("border-radius",1+'px')
            .style("background-color","#FFFFFF")
        ;

        //this._parentElement.style("overflow-x", this.fitTo() === "width" ? "hidden" : null);
        //this._parentElement.style("overflow-y", this.fitTo() === "width" ? "scroll" : null);
//        var dimensions = this.getDimensions();
//        if (this.designMode()) {
//            dimensions.width++;
//            dimensions.height++;
//        }
//        var cellWidth = (this.width() - (this.fitTo() === "width" ? this._scrollBarWidth : 0)) / dimensions.width;
//        var cellHeight = this.fitTo() === "all" ? this.height() / dimensions.height : cellWidth;
//
//        this._colCount = dimensions.width;
//        this._rowCount = dimensions.height;
//        this._colSize = cellWidth;
//        this._rowSize = cellHeight;

        this.updateCells();
        //this.updateDropCells(dimensions, cellWidth, cellHeight);
    };

    Grid.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    Grid.prototype.render = function (callback) {
        var context = this;
        HTMLWidget.prototype.render.call(this, function (widget) {
            if (context.content().length) {
                var renderCount = context.content().length;
                context.content().forEach(function (contentWidget, idx) {
                    setTimeout(function () {
  console.log(contentWidget)
                        contentWidget.render(function () {
                            if (--renderCount === 0) {
                                if (callback) {
                                    callback(widget);
                                }
                            }
                        });
                    }, 0);
                });
            } else {
                if (callback) {
                    callback(widget);
                }
            }
        });
        return this;
    };

    return Grid;
}));
