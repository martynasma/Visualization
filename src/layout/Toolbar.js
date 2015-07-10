"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "../form/Input", "./Cell", "../common/Text", "../common/Icon", "../chart/Pie", "css!./Toolbar"], factory);
    } else {
        root.common_Toolbar = factory(root.d3, root.common_HTMLWidget, root.form_Input, root.layout_Cell, root.common_Text, root.common_Icon);
    }
}(this, function (d3, HTMLWidget, IInput, Cell, Text, Icon, Pie) {
    function Toolbar() {
        HTMLWidget.call(this);

        this._tag = "div";
        this.content([]);
    }
    Toolbar.prototype = Object.create(HTMLWidget.prototype);
    Toolbar.prototype._class += " layout_Toolbar";

    Toolbar.prototype.publish("title", "", "string", "Title",null,{tags:['basic']});
    //Toolbar.prototype.publish("toolbarAnnotations", null, "array", "Widget Array",null,{});
    Toolbar.prototype.publish("content", [], "widgetArray", "widgets",null,{tags:['Private']});

    /*
     * TODO:
     * border thickness
     * border color
     * inside color
     * transparency
     *
     */
    Toolbar.prototype.testData = function () {
        this
            .setContent(0, 0, new Icon().testData().size({width:20,height:20}))
            //.setContent(0, 1, new Icon().testData().size({width:20,height:20}))
            .setContent(1, 1, new Pie().testData())
        ;
        return this;
    };

    Toolbar.prototype.setContent = function (row, col, widget, title, rowSpan, colSpan) {
        rowSpan = rowSpan || 1;
        colSpan = colSpan || 1;
        title = title || "";
        this.content(this.content().filter(function (contentWidget) {
            if (contentWidget.gridRow() === row && contentWidget.gridCol() === col) {
                contentWidget.target(null);
                return false;
            }
            return true;
        }));

        if (widget) {
            var cell = new Cell()
                .gridRow(row)
                .gridCol(col)
                .widget(widget)
                .title(title)
                .gridRowSpan(rowSpan)
                .gridColSpan(colSpan)
                .surfacePadding(0)
                //.cellPadding(0)
                //.surfaceBorderWidth(0)

                .width(widget.width())
                .height(widget.height())
            ;
            this.content().push(cell);
        }
        return this;
    };

    // update this
    Toolbar.prototype.getCell = function (row, col) {
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

    // update this
    Toolbar.prototype.getContent = function (id) {
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

    // ---

    Toolbar.prototype.updateCells = function () {
        var context = this;
        var rows = this._toolbarContainer.selectAll(".cell_" + this._id).data(this.content(), function (d) { return d._id; });
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
        var drag = d3.behavior.drag()
            .on("dragstart", function (d) {
                d3.event.sourceEvent.stopPropagation();

                context._dragCell = d;

                context.setGridOffsets();
                context.findCurrentLocation(d3.event.sourceEvent);

                context._element.selectAll(".dragHandle")
                    .style("visibility", "hidden")
                ;

                context._handle = context.overHandle(d3.event.sourceEvent);
                if(context._dragCell._dragHandles.indexOf(context._handle) === -1){
                    context._handle = undefined;
                }

                context._dragCellOffsetX = context._currLoc[0] - d.gridCol();
                context._dragCellOffsetY = context._currLoc[1] - d.gridRow();
                context.createDropTarget(context._currLoc);
                setTimeout(function () {
                    context._toolbarContainer.selectAll(".cell_" + context._id)
                        .classed("dragItem", function (d2) {
                            return d._id === d2._id;
                        }).classed("notDragItem", function (d2) {
                            return d._id !== d2._id;
                        })
                    ;
                }, 0);
            })
//            .on("drag", function (d) {
//                context._dragCell = d;
//                context.findCurrentLocation(d3.event.sourceEvent);
//                if(typeof (context._currLocation) === 'undefined' || (context._currLocation[0] !== context._currLoc[0] || context._currLocation[1] !== context._currLoc[1])){
//                    context._currLocation = context._currLoc;
//                    context.moveDropTarget(context._currLoc);
//                }
//            })
//            .on("dragend", function () {
//                d3.event.sourceEvent.stopPropagation();
//
//                context._element.selectAll(".dragHandle")
//                    .style("visibility", null)
//                ;
//
//                if (context._handle) {
//                    context._dragCell.gridRow(context._locY);
//                    context._dragCell.gridRowSpan(context._sizeY);
//                    context._dragCell.gridCol(context._locX);
//                    context._dragCell.gridColSpan(context._sizeX);
//                } else {
//                    var targetRow = context._currLoc[1];
//                    var targetCol = context._currLoc[0];
//                    var targetRowSpan = context._dragCell.gridRowSpan();
//                    var targetColSpan = context._dragCell.gridColSpan();
//                    var targetCell = context.getCell(context._currLoc[1], context._currLoc[0]);
//                    if (targetCell === context._dragCell) {
//                        targetRowSpan = targetCell.gridRowSpan();
//                        targetColSpan = targetCell.gridColSpan();
//                        targetCell = null;
//                    }
//                    var newDragCellCol;
//                    var newDragCellRow;
//                    if (targetCell) {
//                        targetRow = targetCell.gridRow();
//                        targetCol = targetCell.gridCol();
//                        targetRowSpan = targetCell.gridRowSpan();
//                        targetColSpan = targetCell.gridColSpan();
//                        targetCell
//                            .gridCol(context._dragCell.gridCol())
//                            .gridColSpan(context._dragCell.gridColSpan())
//                            .gridRow(context._dragCell.gridRow())
//                            .gridRowSpan(context._dragCell.gridRowSpan())
//                        ;
//                        newDragCellCol = targetCol;
//                        newDragCellRow = targetRow;
//                    } else {
//                        newDragCellCol = targetCol - context._dragCellOffsetX;
//                        newDragCellRow = targetRow - context._dragCellOffsetY;
//                    }
//                    context._dragCell
//                        .gridCol(newDragCellCol)
//                        .gridRow(newDragCellRow)
//                        .gridColSpan(targetColSpan)
//                        .gridRowSpan(targetRowSpan)
//                    ;
//                }
//                var gridDropTarget = document.getElementById('grid-drop-target'+context.id());
//                gridDropTarget.parentNode.removeChild(gridDropTarget);
//
//                setTimeout(function () {
//                    context._toolbarContainer.selectAll(".cell_" + context._id)
//                        .classed("dragItem", false)
//                        .classed("notDragItem", false)
//                    ;
//                }, 0);
//
//                context._dragCell = null;
//            });

//        if(this.designMode()){
//            this._toolbarContainer.selectAll(".cell_" + this._id).call(drag);
//        } else {
            this._toolbarContainer.selectAll(".cell_" + this._id).on(".drag", null);
//        }

//        rows.style("left", function (d) { return d.gridCol() * cellWidth + context.gutter() / 2 + "px"; })
//            .style("top", function (d) { return d.gridRow() * cellHeight + context.gutter() / 2 + "px"; })
//            .style("width", function (d) { return d.gridColSpan() * cellWidth - context.gutter() + "px"; })
//            .style("height", function (d) { return d.gridRowSpan() * cellHeight - context.gutter() + "px"; })
//            .each(function (d) {
//                d._parentElement
//                    .attr("draggable", context.designMode())
//                    .selectAll(".dragHandle")
//                        .attr("draggable", context.designMode())
//                ;
//
//                d
//                    .surfacePadding(context.cellPadding())
//                    .resize()
//                ;
//            });
        rows.exit().each(function (d) {
            d
               .target(null)
            ;
            if (d.__grid_watch) {
                d.__grid_watch.remove();
            }
        }).remove();
    };


    // ---

    Toolbar.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        //this._toolbarContainer = element.append("div").attr("class", "toolbar-container").selectAll(".toolbar-widget").data(this.toolbarAnnotations());
        this._toolbarContainer = element.append("div");

    };

    Toolbar.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        this._toolbarContainer
            .style("width",this.width())
            .style("height","20px")
            .style("border-width",1+'px')
            .style("border-color","#ffa500")
            .style("border-style","solid")
            .style("border-radius",1+'px')
            .style("background-color","#FFFFFF")
        ;

        this.updateCells();

    };

    Toolbar.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    Toolbar.prototype.render = function (callback) {
        var context = this;
        HTMLWidget.prototype.render.call(this, function (widget) {
            if (context.content().length) {
                var renderCount = context.content().length;
                context.content().forEach(function (contentWidget, idx) {
                    setTimeout(function () {
                        console.log(contentWidget)
                                    //contentWidget.size({width:20,height:20});
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

    return Toolbar;
}));