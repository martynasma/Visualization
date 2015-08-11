if (typeof define === "function" && define.amd) {
  define('css',[], function () { 
    return {
      load: function ($1, $2, load) { load() }
    } 
  })
};



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('layout/AbsoluteSurface',["d3", "../common/HTMLWidget", "../chart/MultiChart", "css!./AbsoluteSurface", "css!font-awesome",], factory);
    } else {
        root.layout_AbsoluteSurface = factory(root.d3, root.common_HTMLWidget, root.chart_MultiChart);
    }
}(this, function (d3, HTMLWidget, MultiChart) {
    function AbsoluteSurface() {
        HTMLWidget.call(this);

        this._tag = "div";
    }
    AbsoluteSurface.prototype = Object.create(HTMLWidget.prototype);
    AbsoluteSurface.prototype.constructor = AbsoluteSurface;
    AbsoluteSurface.prototype._class += " layout_AbsoluteSurface";

    AbsoluteSurface.prototype.publish("units", "percent", "set", "Units", ["pixels", "percent"]);
    AbsoluteSurface.prototype.publish("x", 0, "number", "Widget XPos");
    AbsoluteSurface.prototype.publish("y", 0, "number", "Widget YPos");
    AbsoluteSurface.prototype.publish("width", "100", "string", "Widget Width, omit for full");
    AbsoluteSurface.prototype.publish("height", "100", "string", "Widget Height, omit for full");
    AbsoluteSurface.prototype.publish("opacity", 1, "number", "Opacity");
    AbsoluteSurface.prototype.publish("widget", null, "widget", "Widget", null, { tags: ["Private"] });

    AbsoluteSurface.prototype.testData = function () {
        this
            .x(25)
            .y(25)
            .width(50)
            .height(50)
            .widget(new MultiChart().testData().chartType("COLUMN"))
        ;
        return this;
    };

    AbsoluteSurface.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
    };

    AbsoluteSurface.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);

        var xPos = 0, yPos = 0, width = this.clientWidth(), height = this.clientHeight();
        switch (this.units()) {
            case "pixels":
                xPos = this.x();
                yPos = this.y();
                width = this.width() === "" ? width - xPos : Number(this.width());
                height = this.height() === "" ? height - yPos : Number(this.height());
                break;
            case "percent":
                xPos = this.x() * width / 100;
                yPos = this.y() * height / 100;
                width = this.width() === "" ? width - xPos : Number(this.width() * width / 100);
                height = this.height() === "" ? height - yPos : Number(this.height() * height / 100);
                break;
        }
        this
            .pos({ x: xPos, y: yPos })
        ;
        element.style("opacity", this.opacity());

        var widgets = element.selectAll("#" + this._id + " > .AbsoluteSurfaceWidget").data(this.widget() ? [this.widget()] : [], function (d) { return d._id; });
        widgets.enter().append("div")
            .attr("class", "AbsoluteSurfaceWidget")
            .each(function (d) {
                d.target(this);
            })
        ;
        widgets
            .each(function (d) {
                d
                    .resize({ width: width, height: height })
                ;
            })
        ;
        widgets.exit().each(function (d) {
            d.target(null);
        }).remove();
    };

    AbsoluteSurface.prototype.exit = function (domNode, element) {
        if (this.widget()) {
            this.widget(null);
            this.render();
        }
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    AbsoluteSurface.prototype.render = function (callback) {
        var context = this;
        return HTMLWidget.prototype.render.call(this, function (widget) {
            if (context.widget()) {
                context.widget().render(function (widget) {
                    if (callback) {
                        callback(widget);
                    }
                });
            } else {
                if (callback) {
                    callback(widget);
                }
            }
        });
    };

    return AbsoluteSurface;
}));



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('layout/Surface.js',["d3", "../common/HTMLWidget", "../chart/MultiChart", "css!./Surface", "css!font-awesome",], factory);
    } else {
        root.layout_Surface = factory(root.d3, root.common_HTMLWidget, root.chart_MultiChart);
    }
}(this, function (d3, HTMLWidget, MultiChart) {
    function Surface() {
        HTMLWidget.call(this);

        this._tag = "div";

        this._surfaceButtons = [];
    }
    Surface.prototype = Object.create(HTMLWidget.prototype);
    Surface.prototype.constructor = Surface;
    Surface.prototype._class += " layout_Surface";

    Surface.prototype.publish("surfaceTitlePadding", null, "number", "Title Padding (px)",null,{tags:['Basic']});
    Surface.prototype.publish("surfaceTitleFontSize", null, "number", "Title Font Size (px)",null,{tags:['Basic']});
    Surface.prototype.publish("surfaceTitleFontColor", null, "html-color", "Title Font Color",null,{tags:['Basic']});
    Surface.prototype.publish("surfaceTitleFontFamily", null, "string", "Title Font Family",null,{tags:['Basic']});
    Surface.prototype.publish("surfaceTitleFontBold", true, "boolean", "Enable Bold Title Font",null,{tags:['Basic']});
    Surface.prototype.publish("surfaceTitleBackgroundColor", null, "html-color", "Title Background Color",null,{tags:['Basic']});

    Surface.prototype.publish("surfacePadding", null, "string", "Surface Padding (px)", null, { tags: ['Intermediate'] });
    Surface.prototype.publish("surfaceBackgroundColor", null, "html-color", "Surface Background Color",null,{tags:['Basic']});
    Surface.prototype.publish("surfaceBorderWidth", null, "number", "Surface Border Width (px)",null,{tags:['Basic']});
    Surface.prototype.publish("surfaceBorderColor", null, "html-color", "Surface Border Color",null,{tags:['Basic']});
    Surface.prototype.publish("surfaceBorderRadius", null, "number", "Surface Border Radius (px)",null,{tags:['Basic']});

    Surface.prototype.publish("title", "", "string", "Title",null,{tags:['Intermediate']});
    Surface.prototype.publish("surfaceTitleAlignment", "center", "set", "Title Alignment", ["left","right","center"],{tags:['Basic']});
    Surface.prototype.publish("widget", null, "widget", "Widget",null,{tags:['Private']});

    Surface.prototype.publish("buttonAnnotations", [], "array", "Button Array",null,{tags:['Private']});

    Surface.prototype.testData = function () {
        this.title("ABC");
        this.widget(new Surface().widget(new MultiChart().testData()));

        this.buttonAnnotations([
            {
                id:"button_1",
                label:"\uf00e",
                width:60,
                padding:"5px",
                class: "",
                font: "FontAwesome",
                callback: function(domNode) {
                    console.log("Click Override on button " + domNode);
                }
            },{
                id:"button_2",
                label:"\uf010",
                width:30,
                padding:"5px",
                class:"",
                font: "FontAwesome",
                callback: function(domNode) {
                    console.log("Click Override on button " + domNode);
                }
            }]);

        return this;
    };

    Surface.prototype.widgetSize = function (titleDiv, widgetDiv) {
        var width = this.clientWidth();
        var height = this.clientHeight();
        if (this.title()) {
            height -= this.calcHeight(titleDiv);
        }
        height -= this.calcFrameHeight(widgetDiv);
        width -= this.calcFrameWidth(widgetDiv);
        return { width: width, height: height };
    };

    Surface.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
    };

    Surface.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        var context = this;

        element
            .style("border-width",this.surfaceBorderWidth()+'px')
            .style("border-color",this.surfaceBorderColor())
            .style("border-radius",this.surfaceBorderRadius()+'px')
            .style("background-color",this.surfaceBackgroundColor())
        ;

        var titles = element.selectAll(".surfaceTitle").data(this.title() ? [this.title()] : []);
        titles.enter().insert("h3", "div")
            .attr("class", "surfaceTitle")
        ;
        titles
            .text(function (d) { return d; })
            .style("text-align",this.surfaceTitleAlignment())
            .style("color",this.surfaceTitleFontColor())
            .style("font-size",this.surfaceTitleFontSize()+"px")
            .style("font-family",this.surfaceTitleFontFamily())
            .style("font-weight",this.surfaceTitleFontBold() ? "bold" : "normal")
            .style("background-color",this.surfaceTitleBackgroundColor())
            .style("padding",this.surfaceTitlePadding()+"px")
        ;
        titles.exit().remove();

        var surfaceTitle = element.select(".surfaceTitle");

        var surfaceButtons = surfaceTitle.append("div").attr("class","html-button-container").selectAll(".surface-button").data(this.buttonAnnotations());
        surfaceButtons.enter().append("button").classed("surface-button",true)
            .each(function (button, idx) {
                var el = context._surfaceButtons[idx] = d3.select(this)
                    .attr("class", "surface-button " + button.class)
                    .attr("id", button.id)
                    .style('padding', button.padding)
                    .style('width', button.width)
                    .style('height', button.height)
                    .style("cursor","pointer");
                if (button.font === "FontAwesome") {
                    el
                      .append('i')
                      .attr("class","fa")
                      .text(function(d) { return button.label; })
                      .on("click", function(d) { context.click(d); });
                } else {
                    el
                      .text(function(d) { return button.label; })
                      .on("click", function(d) { context.click(d); });
                }
            })
        ;
        surfaceButtons.exit()
            .each(function (d, idx) {
                var element = d3.select(this);
                delete context._surfaceButtons[idx];
                element.remove();
            })
        ;
        var widgets = element.selectAll("#" + this._id + " > .surfaceWidget").data(this.widget() ? [this.widget()] : [], function (d) { return d._id; });

        widgets.enter().append("div")
            .attr("class", "surfaceWidget")
            .each(function (d) {
                d.target(this);
            })
        ;
        widgets
            .style("padding", this.surfacePadding() ? this.surfacePadding() + "px" : null)
            .each(function (d) {
                var widgetSize = context.widgetSize(element.select("h3"), d3.select(this));
                d
                    .resize({ width: widgetSize.width, height: widgetSize.height })
                ;
            })
        ;
        widgets.exit().each(function (d) {
            d.target(null);
        }).remove();
    };

    Surface.prototype.exit = function (domNode, element) {
        if (this.widget()) {
            this.widget(null);
            this.render();
        }
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    Surface.prototype.render = function (callback) {
        var context = this;
        return HTMLWidget.prototype.render.call(this, function (widget) {
            if (context.widget()) {
                context.widget().render(function (widget) {
                    if (callback) {
                        callback(widget);
                    }
                });
            } else {
                if (callback) {
                    callback(widget);
                }
            }
        });
    };

    Surface.prototype.click = function(obj) {
        console.log('Clicked: ' + obj.id);
    };

    return Surface;
}));


(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('layout/Cell.js',["./Surface"], factory);
    } else {
        root.layout_Cell = factory(root.layout_Surface);
    }
}(this, function (Surface) {
    function Cell() {
        Surface.call(this);
        this._dragHandles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
    }
    Cell.prototype = Object.create(Surface.prototype);
    Cell.prototype.constructor = Cell;
    Cell.prototype._class += " layout_Cell";

    Cell.prototype.publish("gridRow", 0, "number", "Grid Row Position",null,{tags:['Private']});
    Cell.prototype.publish("gridCol", 0, "number", "Grid Column Position",null,{tags:['Private']});
    Cell.prototype.publish("gridRowSpan", 1, "number", "Grid Row Span",null,{tags:['Private']});
    Cell.prototype.publish("gridColSpan", 1, "number", "Grid Column Span",null,{tags:['Private']});
    Cell.prototype.publish("handleSize", 6, "number", "Grid Row Position",null,{tags:['Private']});

    Cell.prototype.enter = function (domNode, element) {
        Surface.prototype.enter.apply(this, arguments);
        element.classed("layout_Surface", true);
    };

    Cell.prototype.update = function (domNode, element) {
        Surface.prototype.update.apply(this, arguments);
        var context = this;
        var offsetMultiple;

        var dragHandles = element.selectAll(".dragHandle").data(this._dragHandles, function (d) { return d; });
        dragHandles.enter().append("div")
            .attr("class", function (d) { return "dragHandle dragHandle_" + d; })
            .style("position", "absolute")
        ;

        dragHandles
            .style({
                padding: "0px",
                margin: "0px",
                left: function (d) {
                    switch (d) {
                        case "ne":
                        case "e":
                        case "se":
                            return context._size.width - context.handleSize() + "px";
                        case "nw":
                        case "w":
                        case "sw":
                            return "0px";
                        case "n":
                            offsetMultiple = 0;
                            if(context._dragHandles.indexOf('nw') !== -1){
                                offsetMultiple++;
                            }
                            return context.handleSize()*offsetMultiple + "px";
                        case "s":
                            offsetMultiple = 0;
                            if(context._dragHandles.indexOf('sw') !== -1){
                                offsetMultiple++;
                            }
                            return context.handleSize()*offsetMultiple + "px";
                    }
                },
                top: function (d) {
                    switch (d) {
                        case "nw":
                        case "n":
                        case "ne":
                            return "0px";
                        case "e":
                            offsetMultiple = 0;
                            if(context._dragHandles.indexOf('ne') !== -1){
                                offsetMultiple++;
                            }
                            return context.handleSize()*offsetMultiple + "px";
                        case "w":
                            offsetMultiple = 0;
                            if(context._dragHandles.indexOf('nw') !== -1){
                                offsetMultiple++;
                            }
                            return context.handleSize()*offsetMultiple + "px";
                        case "sw":
                        case "s":
                        case "se":
                            return context._size.height - context.handleSize() + "px";
                    }
                },
                width: function (d) {
                    switch (d) {
                        case "n":
                            offsetMultiple = 0;
                            if(context._dragHandles.indexOf('ne') !== -1){
                                offsetMultiple++;
                            }
                            if(context._dragHandles.indexOf('nw') !== -1){
                                offsetMultiple++;
                            }
                            return context._size.width - (context.handleSize()*offsetMultiple) + "px";
                        case "s":
                            offsetMultiple = 0;
                            if(context._dragHandles.indexOf('se') !== -1){
                                offsetMultiple++;
                            }
                            if(context._dragHandles.indexOf('sw') !== -1){
                                offsetMultiple++;
                            }
                            return context._size.width - (context.handleSize()*offsetMultiple) + "px";
                        default:
                            return context.handleSize() + "px";
                    }
                },
                height: function (d) {
                    switch (d) {
                        case "w":
                            offsetMultiple = 0;
                            if(context._dragHandles.indexOf('nw') !== -1){
                                offsetMultiple++;
                            }
                            if(context._dragHandles.indexOf('sw') !== -1){
                                offsetMultiple++;
                            }
                            return context._size.height - (context.handleSize()*offsetMultiple) + "px";
                        case "e":
                            offsetMultiple = 0;
                            if(context._dragHandles.indexOf('ne') !== -1){
                                offsetMultiple++;
                            }
                            if(context._dragHandles.indexOf('se') !== -1){
                                offsetMultiple++;
                            }
                            return context._size.height - (context.handleSize()*offsetMultiple) + "px";
                        default:
                            return context.handleSize() + "px";
                    }
                },
            })
        ;
        dragHandles.exit().remove();
    };

    return Cell;
}));



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('layout/Border.js',["d3", "../common/HTMLWidget", "./Cell", "../common/Text", "css!./Border"], factory);
    } else {
        root.layout_Grid = factory(root.d3, root.common_HTMLWidget, root.layout_Cell, root.common_Text, root.chart_Pie, root.chart_MultiChart, root.c3chart_Line);
    }
}(this, function (d3, HTMLWidget, Cell, Text) {
    function Border() {
        HTMLWidget.call(this);

        this._tag = "div";
        
        this._colCount = 0;
        this._rowCount = 0;
        this._colSize = 0;
        this._rowSize = 0;
        
        this.content([]);
    }
    Border.prototype = Object.create(HTMLWidget.prototype);
    Border.prototype.constructor = Border;
    Border.prototype._class += " layout_Border";

    Border.prototype.publish("gutter", 4, "number", "Gap Between Widgets",null,{tags:['Private']});
    
    Border.prototype.publish("designMode", false, "boolean", "Design Mode",null,{tags:['Private']});
    
    Border.prototype.publish("layoutType", "Default", "set", "This determines the placement/size of the Cells relative to the Border._target element", ["Default"], { tags: ['Private'] });
    
    Border.prototype.publish("topCellSize", 100, "number", "Height of the 'Top' Cell (px)",null,{tags:['Private']});
    Border.prototype.publish("leftCellSize", 150, "number", "Width of the 'Left' Cell (px)",null,{tags:['Private']});
    Border.prototype.publish("rightCellSize", 250, "number", "Width of the 'Right' Cell (px)",null,{tags:['Private']});
    Border.prototype.publish("bottomCellSize", 80, "number", "Height of the 'Bottom' Cell (px)",null,{tags:['Private']});
    
    Border.prototype.publish("topCellPercentage", 0, "number", "Percentage (of parent) Height of the 'Top' Cell",null,{tags:['Private']});
    Border.prototype.publish("leftCellPercentage", 0, "number", "Percentage (of parent) Width of the 'Left' Cell",null,{tags:['Private']});
    Border.prototype.publish("rightCellPercentage", 0, "number", "Percentage (of parent) Width of the 'Right' Cell",null,{tags:['Private']});
    Border.prototype.publish("bottomCellPercentage", 0, "number", "Percentage (of parent) Height of the 'Bottom' Cell",null,{tags:['Private']});
    
    Border.prototype.publish("cellPadding", "0px", "string", "Cell Padding (px)", null, { tags: ['Intermediate'] });

    Border.prototype.publish("content", [], "widgetArray", "widgets",null,{tags:['Private']});
    
    Border.prototype.publish("sectionTypes", [], "array", "Section Types sharing an index with 'content' - Used to determine position/size.",null,{tags:['Private']});

    Border.prototype.testData = function () {
        this
            .setContent("topSection",new Text().testData())
            .setContent("rightSection",new Text().testData())
            .setContent("bottomSection",new Text().testData())
            .setContent("leftSection",new Text().testData())
            .setContent("centerSection",new Text().testData())
        ;
        
        return this;
    };
    
    Border.prototype.applyLayoutType = function (layoutType) {
        var layoutObj = this.borderLayoutObject(layoutType);
        for(var i in this.content()){
            this.content()[i]._fixedLeft = layoutObj[this.sectionTypes()[i]].left;
            this.content()[i]._fixedTop = layoutObj[this.sectionTypes()[i]].top;
            this.content()[i]._fixedWidth = layoutObj[this.sectionTypes()[i]].width;
            this.content()[i]._fixedHeight = layoutObj[this.sectionTypes()[i]].height;
            this.content()[i]._dragHandles = this.cellSpecificDragHandles(this.sectionTypes()[i]);
        }
    };
    Border.prototype.cellSpecificDragHandles = function (sectionType) {
        switch(this.layoutType()){
            default:
                switch(sectionType){
                    case 'topSection':return ["s"];
                    case 'rightSection':return ["w"];
                    case 'bottomSection':return ["n"];
                    case 'leftSection':return ["e"];
                    case 'centerSection':return [];
                }
        }
    };
    Border.prototype.borderLayoutObject = function (layoutType) {
        var t,b,r,l,c,retObj = {},context=this;
        var topSize,topPerc,bottomSize,bottomPerc,leftSize,leftPerc,rightSize,rightPerc;
        
        var gridRect = this.target().getBoundingClientRect();
        switch(layoutType){
            default:
                if(this.sectionTypes().indexOf('topSection') !== -1){
                    topSize = this.topCellSize();
                    topPerc = this.topCellPercentage();
                }
                if(this.sectionTypes().indexOf('bottomSection') !== -1){
                    bottomSize = this.bottomCellSize();
                    bottomPerc = this.bottomCellPercentage();
                }
                if(this.sectionTypes().indexOf('leftSection') !== -1){
                    leftSize = this.leftCellSize();
                    leftPerc = this.leftCellPercentage();
                }   
                if(this.sectionTypes().indexOf('rightSection') !== -1){
                    rightSize = this.rightCellSize();
                    rightPerc = this.rightCellPercentage();
                }
                
                t = _sectionPlacementObject({
                    width:{"px":0,"%":100},
                    height:{"px":topSize,"%":topPerc},
                    top:{"px":0,"%":0},
                    left:{"px":0,"%":0}
                });
                b = _sectionPlacementObject({
                    width:{"px":0,"%":100},
                    height:{"px":bottomSize,"%":bottomPerc},
                    top:{"px":0,"%":100},
                    left:{"px":0,"%":0}
                });
                b.top -= b.height;
                l = _sectionPlacementObject({
                    width:{"px":leftSize,"%":leftPerc},
                    height:{"px":-t.height-b.height,"%":100},
                    top:{"px":t.height,"%":0},
                    left:{"px":0,"%":0}
                });
                r = _sectionPlacementObject({
                    width:{"px":rightSize,"%":rightPerc},
                    height:{"px":-t.height-b.height,"%":100},
                    top:{"px":t.height,"%":0},
                    left:{"px":0,"%":100}
                });
                r.left -= r.width;
                c = _sectionPlacementObject({
                    width:{"px":-r.width-l.width,"%":100},
                    height:{"px":-t.height-b.height,"%":100},
                    top:{"px":t.height,"%":0},
                    left:{"px":l.width,"%":0}
                });
                retObj['topSection'] = t;
                retObj['bottomSection'] = b;
                retObj['rightSection'] = r;
                retObj['leftSection'] = l;
                retObj['centerSection'] = c;
        }
        return retObj;
        
        function _sectionPlacementObject(obj){
            obj.width['px'] = typeof (obj.width['px']) !== 'undefined' ? obj.width['px'] : 0;
            obj.width['%'] = typeof (obj.width['%']) !== 'undefined' ? obj.width['%'] : 0;
            obj.height['px'] = typeof (obj.height['px']) !== 'undefined' ? obj.height['px'] : 0;
            obj.height['%'] = typeof (obj.height['%']) !== 'undefined' ? obj.height['%'] : 0;
            var ret = {
                width:obj.width['px'] + (obj.width['%']/100 * gridRect.width),
                height:obj.height['px'] + (obj.height['%']/100 * gridRect.height),
                top:obj.top['px'] + (obj.top['%']/100 * gridRect.height) + context.gutter()/2,
                left:obj.left['px'] + (obj.left['%']/100 * gridRect.width) + context.gutter()/2
            };
            return ret;
        }
    };

    Border.prototype.clearContent = function () {
        this.content(this.content().filter(function (contentWidget) {
            contentWidget.target(null);
            return false;
        }));
        this.sectionTypes([]);
    };

    Border.prototype.setContent = function (sectionType, widget, title) {
        title = typeof (title) !== 'undefined' ? title : "";
        var arr = this.sectionTypes();
        if (widget) {
            var cell = new Cell()
                .widget(widget)
                .title(title)
            ;
            this.content().push(cell);
            arr.push(sectionType);
        }
        this.sectionTypes(arr);
        return this;
    };

    Border.prototype.getContent = function (id) {
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
    
    Border.prototype.getCellSize = function(i){
        switch(this.sectionTypes()[i]){
            case 'topSection':return this.topCellSize();
            case 'rightSection':return this.rightCellSize();
            case 'bottomSection':return this.bottomCellSize();
            case 'leftSection':return this.leftCellSize();
        }
    };
    Border.prototype.changeCellSize = function(i,delta){
        switch(this.sectionTypes()[i]){
            case 'topSection': 
                this.topCellSize(this.topCellSize() + delta);
                break;
            case 'rightSection': 
                this.rightCellSize(this.rightCellSize() + delta);
                break;
            case 'bottomSection': 
                this.bottomCellSize(this.bottomCellSize() + delta);
                break;
            case 'leftSection': 
                this.leftCellSize(this.leftCellSize() + delta);
                break;
            case 'centerSection': 
                this.centerCellSize(this.centerCellSize() + delta);
                break;
        }
    };
    
    Border.prototype.overHandle = function (e) {
        var handle = '';
        var handleSize = this._dragCell.handleSize();
        
        var top = this._offsetY + this._dragCell._fixedTop - this.gutter()/2;
        var left = this._offsetX + this._dragCell._fixedLeft - this.gutter()/2;
        var width = this._dragCell._fixedWidth;
        var height = this._dragCell._fixedHeight;
        
        if(Math.ceil(top + height - this.gutter()) >= e.clientY && Math.floor(top + height - handleSize - this.gutter()) <= e.clientY){
            handle = 's';//within SOUTH handle range
        }
        else if(Math.floor(top) <= e.clientY && Math.ceil(top + handleSize) >= e.clientY){
            handle = 'n';//within NORTH handle range
        }
        if(Math.ceil(left + width - this.gutter()) >= e.clientX && Math.floor(left + width - handleSize - this.gutter()) <= e.clientX){
            handle += 'e';//within EAST handle range
        }
        else if(Math.floor(left) <= e.clientX && Math.ceil(left + handleSize) >= e.clientX){
            handle += 'w';//within WEST handle range
        }
        return handle;
    };
    
    Border.prototype.setLayoutOffsets = function () {
        this._offsetX = this._element.node().getBoundingClientRect().left + (this.gutter()/2);
        this._offsetY = this._element.node().getBoundingClientRect().top + (this.gutter()/2);
    };
    
    Border.prototype.dragStart = function(d,i){
        d3.event.sourceEvent.stopPropagation();
        var context = this;
        
        this._dragCell = d;
        this._dragCellStartSize = this.getCellSize(i);

        context._handle = context.overHandle(d3.event.sourceEvent);
        if(context._dragCell._dragHandles.indexOf(context._handle) === -1){
            context._handle = undefined;
        }
        this._dragPrevX = d3.event.sourceEvent.clientX;
        this._dragPrevY = d3.event.sourceEvent.clientY;
    };
    Border.prototype.dragTick = function(d,i){
        if(this._handle){
            var xDelta = this._dragPrevX - d3.event.sourceEvent.clientX;
            var yDelta = this._dragPrevY - d3.event.sourceEvent.clientY;

            switch(this._sectionTypeArr[i]){
                case 'topSection':
                    if(yDelta !== 0){
                        this.changeCellSize(i,-yDelta);
                    }
                    break;
                case 'rightSection':
                    if(xDelta !== 0){
                        this.changeCellSize(i,xDelta);
                    }
                    break;
                case 'bottomSection':
                    if(yDelta !== 0){
                        this.changeCellSize(i,yDelta);
                    }
                    break;
                case 'leftSection':
                    if(xDelta !== 0){
                        this.changeCellSize(i,-xDelta);
                    }
                    break;
                case 'centerSection':
                    break;
            }

            this._dragPrevX = d3.event.sourceEvent.clientX;
            this._dragPrevY = d3.event.sourceEvent.clientY;
        }
        this.render();
    };
    Border.prototype.dragEnd = function(d){
        this.render();
    };
    
    Border.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        element.style("position", "relative");
        this.dropDiv = element.append("div");
        this.contentDiv = element.append("div");
        this._scrollBarWidth = this.getScrollbarWidth();
    };

    Border.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        this._sectionTypeArr = this.sectionTypes();
        var context = this;

        this.setLayoutOffsets();
        
        var rows = this.contentDiv.selectAll(".cell_" + this._id).data(this.content(), function (d) { return d._id; });
        rows.enter().append("div")
            .attr("class", "cell_" + this._id)
            .style("position", "absolute")
            .each(function (d) {
                d
                   .target(this)
                ;
            });
            
        var drag = d3.behavior.drag()
            .on("dragstart", function (d,i) { context.dragStart.call(context,d,i); })
            .on("drag", function (d,i) { context.dragTick.call(context,d,i); })
            .on("dragend", function (d,i) { context.dragEnd.call(context,d,i); })
        ;
        if(this.designMode()){ 
            this.contentDiv.selectAll(".cell_" + this._id).call(drag);
        } else {
            this.contentDiv.selectAll(".cell_" + this._id).on(".drag", null);
        }
        this.applyLayoutType(this.layoutType());
        
        rows
            .style("left", function (d) { return d._fixedLeft + "px"; })
            .style("top", function (d) { return d._fixedTop + "px"; })
            .style("width", function (d) { return d._fixedWidth - context.gutter() + "px"; })
            .style("height", function (d) { return d._fixedHeight - context.gutter() + "px"; })
            .each(function (d) {
                d._parentElement
                    .attr("draggable", context.designMode())
                    .selectAll(".dragHandle")
                        .attr("draggable", context.designMode())
                ;
                d
                    .surfacePadding(context.cellPadding())
                    .resize()
                ;
            });
        rows.exit().each(function (d) {
            d
               .target(null)
            ;
        }).remove();
        
    };

    Border.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    Border.prototype.render = function (callback) {
        var context = this;
        HTMLWidget.prototype.render.call(this, function (widget) {
            if (context.content().length) {
                var renderCount = context.content().length;
                context.content().forEach(function (contentWidget, idx) {
                    setTimeout(function () {
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
    
    return Border;
}));



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('layout/Grid.js',["d3", "../common/HTMLWidget", "./Cell", "../common/Text", "../chart/Pie", "../chart/MultiChart", "../c3chart/Line", "css!./Grid"], factory);
    } else {
        root.layout_Grid = factory(root.d3, root.common_HTMLWidget, root.layout_Cell, root.common_Text, root.chart_Pie, root.chart_MultiChart, root.c3chart_Line);
    }
}(this, function (d3, HTMLWidget, Cell, Text, Pie, MultiChart, Line) {
    function Grid() {
        HTMLWidget.call(this);

        this._tag = "div";
        
        this._colCount = 0;
        this._rowCount = 0;
        this._colSize = 0;
        this._rowSize = 0;
        
        this.content([]);
    }
    Grid.prototype = Object.create(HTMLWidget.prototype);
    Grid.prototype.constructor = Grid;
    Grid.prototype._class += " layout_Grid";

    Grid.prototype.publish("designMode", false, "boolean", "Design Mode",null,{tags:['Private']});
    Grid.prototype.publish("gutter", 4, "number", "Gap Between Widgets",null,{tags:['Private']});
    Grid.prototype.publish("fitTo", "all", "set", "Sizing Strategy", ["all", "width"], { tags: ['Private'] });

    Grid.prototype.publish("cellPadding", null, "string", "Cell Padding (px)", null, { tags: ['Intermediate'] });

    Grid.prototype.publish("content", [], "widgetArray", "widgets",null,{tags:['Private']});

    Grid.prototype.testData = function () {
        this
            .setContent(0, 0, new Pie().testData())
            .setContent(0, 1, new Pie().testData())
            .setContent(1, 0, new Pie().testData())
            .setContent(1, 1, new Pie().testData())
            .setContent(0, 2, new MultiChart().testData(), "Title AAA", 2, 2)
            .setContent(2, 0, new Line().testData(), "Title BBB", 2, 4)
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

    Grid.prototype.setContent = function (row, col, widget, title, rowSpan, colSpan) {
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
        this.dropDiv = element.append("div");
        this.contentDiv = element.append("div");
        this._scrollBarWidth = this.getScrollbarWidth();
    };

    Grid.prototype.findCurrentLocation = function (e) {
        this._currLoc = [
            Math.floor((e.clientX - this._offsetX)/this._colSize),
            Math.floor((e.clientY - this._offsetY)/this._rowSize)
        ];
    };
    
    Grid.prototype.overHandle = function (e) {
        var handle = '';
        var handleSize = this._dragCell.handleSize();
        
        //Determines which edge cell (if any) this._currLoc is hovering over
        //An "edge" meaning a dropCell on the exterrior edge of a surface that covers many cells
        var onSouthEdge = this._dragCell.gridRowSpan() === this._currLoc[1] - this._dragCell.gridRow() + 1;
        var onNorthEdge = this._dragCell.gridRow() === this._currLoc[1];
        var onEastEdge = this._dragCell.gridColSpan() === this._currLoc[0] - this._dragCell.gridCol() + 1;
        var onWestEdge = this._dragCell.gridCol() === this._currLoc[0];
        
        var top = this._offsetY + ((this._currLoc[1]) * this._rowSize);
        var left = this._offsetX + ((this._currLoc[0]) * this._colSize);
        var width = this._colSize - this.gutter();
        var height = this._rowSize - this.gutter();
        
        if(Math.ceil(top + height) >= e.clientY && Math.floor(top + height - handleSize) <= e.clientY && onSouthEdge){
            handle = 's';//within SOUTH handle range
        }
        else if(Math.floor(top) <= e.clientY && Math.ceil(top + handleSize) >= e.clientY && onNorthEdge){
            handle = 'n';//within NORTH handle range
        }
        if(Math.ceil(left + width) >= e.clientX && Math.floor(left + width - handleSize) <= e.clientX && onEastEdge){
            handle += 'e';//within EAST handle range
        }
        else if(Math.floor(left) <= e.clientX && Math.ceil(left + handleSize) >= e.clientX && onWestEdge){
            handle += 'w';//within WEST handle range
        }
        return handle;
    };
    
    Grid.prototype.createDropTarget = function (loc) {
        var col = loc[0] - this._dragCellOffsetX;
        var row = loc[1] - this._dragCellOffsetY;
        var colSpan = this._dragCell.gridColSpan();
        var rowSpan = this._dragCell.gridRowSpan();
        
        var dropTarget = document.createElement('div');
        dropTarget.id = 'grid-drop-target'+this.id();
        dropTarget.className = 'grid-drop-target';
        
        this._element.node().appendChild(dropTarget);
        this.updateDropTarget(col,row,colSpan,rowSpan);
    };
    
    Grid.prototype.setGridOffsets = function () {
        this._offsetX = this._element.node().getBoundingClientRect().left + (this.gutter()/2);
        this._offsetY = this._element.node().getBoundingClientRect().top + (this.gutter()/2);
    };
    
    Grid.prototype.updateDropTarget = function (col,row,colSpan,rowSpan) {
        var top,left,width,height;
        top = this._offsetY + (row * this._rowSize);
        left = this._offsetX + (col * this._colSize);
        width = colSpan * this._colSize - this.gutter();
        height = rowSpan * this._rowSize - this.gutter();
        
        var dropTarget = document.getElementById('grid-drop-target'+this.id());
        dropTarget.style.top = top + 'px';
        dropTarget.style.left = left + 'px';
        dropTarget.style.width = width + 'px';
        dropTarget.style.height = height + 'px';
    };
    
    Grid.prototype.moveDropTarget = function (loc) {
        if(this._handle){
            var pivotCell = [];
            switch(this._handle){
                case 'nw':
                    pivotCell = [this._dragCell.gridCol()+this._dragCell.gridColSpan()-1,this._dragCell.gridRow()+this._dragCell.gridRowSpan()-1];
                    break;
                case 'n':
                case 'ne':
                    pivotCell = [this._dragCell.gridCol(),this._dragCell.gridRow()+this._dragCell.gridRowSpan()-1];
                    break;
                case 'e':
                case 'se':
                case 's':
                    pivotCell = [this._dragCell.gridCol(),this._dragCell.gridRow()];
                    break;
                case 'sw':
                case 'w':
                    pivotCell = [this._dragCell.gridCol()+this._dragCell.gridColSpan()-1,this._dragCell.gridRow()];
                    break;
            }
            switch(this._handle){
                case 'e':
                case 'w':
                    this._locY = pivotCell[1];
                    break;
                default:
                    this._locY = loc[1] <= pivotCell[1] ? loc[1] : pivotCell[1];
                    break;
            }
            switch(this._handle){
                case 'n':
                case 's':
                    this._locX = pivotCell[0];
                    break;
                default:
                    this._locX = loc[0] <= pivotCell[0] ? loc[0] : pivotCell[0];
                    break;
            }
            switch(this._handle){
                case 'n':
                case 's':
                    this._sizeX = this._dragCell.gridColSpan();
                    break;
                default:
                    this._sizeX = Math.abs(loc[0] - pivotCell[0]) + 1;
                    break;
            }
            switch(this._handle){
                case 'e':
                case 'w':
                    this._sizeY = this._dragCell.gridRowSpan();
                    break;
                default:
                    this._sizeY = Math.abs(loc[1] - pivotCell[1]) + 1;
                    break;
            }
        } else if (document.getElementById('grid-drop-target'+this.id()) !== null) {
            var target = this.getCell(loc[1], loc[0]);
            if(target !== null && this._dragCell._id !== target._id){
                document.getElementById('grid-drop-target'+this.id()).className = 'grid-drop-target drop-target-over';
                this._locX = target.gridCol();
                this._locY = target.gridRow();
                this._sizeX = target.gridColSpan();
                this._sizeY = target.gridRowSpan();
            } else {
                document.getElementById('grid-drop-target'+this.id()).className = 'grid-drop-target';
                this._locX = loc[0] - this._dragCellOffsetX;
                this._locY = loc[1] - this._dragCellOffsetY;
                this._sizeX = this._dragCell.gridColSpan();
                this._sizeY = this._dragCell.gridRowSpan();
            }
        }
        
        this.updateDropTarget(this._locX,this._locY,this._sizeX,this._sizeY);
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
                    context.contentDiv.selectAll(".cell_" + context._id)
                        .classed("dragItem", function (d2) {
                            return d._id === d2._id;
                        }).classed("notDragItem", function (d2) {
                            return d._id !== d2._id;
                        })
                    ;
                }, 0);
            })
            .on("drag", function (d) {
                context._dragCell = d;
                context.findCurrentLocation(d3.event.sourceEvent);
                if(typeof (context._currLocation) === 'undefined' || (context._currLocation[0] !== context._currLoc[0] || context._currLocation[1] !== context._currLoc[1])){
                    context._currLocation = context._currLoc;
                    context.moveDropTarget(context._currLoc);
                }
            })
            .on("dragend", function () {
                d3.event.sourceEvent.stopPropagation();
        
                context._element.selectAll(".dragHandle")
                    .style("visibility", null)
                ;
        
                if (context._handle) {
                    context._dragCell.gridRow(context._locY);
                    context._dragCell.gridRowSpan(context._sizeY);
                    context._dragCell.gridCol(context._locX);
                    context._dragCell.gridColSpan(context._sizeX);
                } else {
                    var targetRow = context._currLoc[1];
                    var targetCol = context._currLoc[0];
                    var targetRowSpan = context._dragCell.gridRowSpan();
                    var targetColSpan = context._dragCell.gridColSpan();
                    var targetCell = context.getCell(context._currLoc[1], context._currLoc[0]);
                    if (targetCell === context._dragCell) {
                        targetRowSpan = targetCell.gridRowSpan();
                        targetColSpan = targetCell.gridColSpan();
                        targetCell = null;
                    }
                    var newDragCellCol;
                    var newDragCellRow;
                    if (targetCell) {
                        targetRow = targetCell.gridRow();
                        targetCol = targetCell.gridCol();
                        targetRowSpan = targetCell.gridRowSpan();
                        targetColSpan = targetCell.gridColSpan();
                        targetCell
                            .gridCol(context._dragCell.gridCol())
                            .gridColSpan(context._dragCell.gridColSpan())
                            .gridRow(context._dragCell.gridRow())
                            .gridRowSpan(context._dragCell.gridRowSpan())
                        ;
                        newDragCellCol = targetCol;
                        newDragCellRow = targetRow;
                    } else {
                        newDragCellCol = targetCol - context._dragCellOffsetX;
                        newDragCellRow = targetRow - context._dragCellOffsetY;
                    }
                    context._dragCell
                        .gridCol(newDragCellCol)
                        .gridRow(newDragCellRow)
                        .gridColSpan(targetColSpan)
                        .gridRowSpan(targetRowSpan)
                    ;
                }
                var gridDropTarget = document.getElementById('grid-drop-target'+context.id());
                gridDropTarget.parentNode.removeChild(gridDropTarget);
                
                setTimeout(function () {
                    context.contentDiv.selectAll(".cell_" + context._id)
                        .classed("dragItem", false)
                        .classed("notDragItem", false)
                    ;
                }, 0);

                context._dragCell = null;
            });
            
        if(this.designMode()){ 
            this.contentDiv.selectAll(".cell_" + this._id).call(drag);
        } else {
            this.contentDiv.selectAll(".cell_" + this._id).on(".drag", null);
        }
        
        rows.style("left", function (d) { return d.gridCol() * cellWidth + context.gutter() / 2 + "px"; })
            .style("top", function (d) { return d.gridRow() * cellHeight + context.gutter() / 2 + "px"; })
            .style("width", function (d) { return d.gridColSpan() * cellWidth - context.gutter() + "px"; })
            .style("height", function (d) { return d.gridRowSpan() * cellHeight - context.gutter() + "px"; })
            .each(function (d) {
                d._parentElement
                    .attr("draggable", context.designMode())
                    .selectAll(".dragHandle")
                        .attr("draggable", context.designMode())
                ;

                d
                    .surfacePadding(context.cellPadding())
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

    Grid.prototype.updateDropCells = function (dimensions, cellWidth, cellHeight) {
        var dropCells = [];
        if (this.designMode()) {
            for (var rowIdx = 0; rowIdx < dimensions.height; ++rowIdx) {
                for (var colIdx = 0; colIdx < dimensions.width; ++colIdx) {
                    dropCells.push({ x: colIdx, y: rowIdx });
                }
            }
        }
        var dropRows = this.dropDiv.selectAll(".dropCell_" + this._id).data(dropCells);
        dropRows.enter().append("div")
            .attr("class", "dropCell dropCell_" + this._id);
    
        var context = this;
        dropRows
            .style("position", "absolute")
            .style("left", function (d) { return d.x * cellWidth + context.gutter() / 2 + "px"; })
            .style("top", function (d) { return d.y * cellHeight + context.gutter() / 2 + "px"; })
            .style("width", function (d) { return 1 * cellWidth - context.gutter() + "px"; })
            .style("height", function (d) { return 1 * cellHeight - context.gutter() + "px"; })
        ;
        dropRows.exit().remove();
    };

    Grid.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        
        this._parentElement.style("overflow-x", this.fitTo() === "width" ? "hidden" : null);
        this._parentElement.style("overflow-y", this.fitTo() === "width" ? "scroll" : null);
        var dimensions = this.getDimensions();
        if (this.designMode()) {
            dimensions.width++;
            dimensions.height++;
        }
        var cellWidth = (this.width() - (this.fitTo() === "width" ? this._scrollBarWidth : 0)) / dimensions.width;
        var cellHeight = this.fitTo() === "all" ? this.height() / dimensions.height : cellWidth;

        this._colCount = dimensions.width;
        this._rowCount = dimensions.height;
        this._colSize = cellWidth;
        this._rowSize = cellHeight;

        this.updateCells(cellWidth, cellHeight);
        this.updateDropCells(dimensions, cellWidth, cellHeight);
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



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('layout/Layered.js',["d3", "../common/HTMLWidget", "../layout/AbsoluteSurface", "../chart/Pie", "../map/ChoroplethStates", "../chart/Column", "../common/Text", "css!./Layered"], factory);
    } else {
        root.form_Form = factory(root.d3, root.common_HTMLWidget, root.layout_AbsoluteSurface, root.chart_Pie, root.map_ChoroplethStates, root.chart_Line, root.common_Text);
    }
}(this, function (d3, HTMLWidget, AbsoluteSurface, Pie, ChoroplethStates, Line, Text) {
    function Layered() {
        HTMLWidget.call(this);

        this._tag = "div";
    }
    Layered.prototype = Object.create(HTMLWidget.prototype);
    Layered.prototype.constructor = Layered;
    Layered.prototype._class += " layout_Layered";

    Layered.prototype.publish("padding", 0, "number", "Padding");

    Layered.prototype.publish("widgets", [], "widgetArray", "widgets", null, { tags: ['Private'] });

    Layered.prototype.testData = function () {
        this
            .addLayer(new AbsoluteSurface().x(0).y(0).width(100).height(100).widget(new Line().testData()))
            .addLayer(new AbsoluteSurface().x(40).y(40).width(50).height(50).opacity(0.66).widget(new Pie().testData()))
            .addLayer(new AbsoluteSurface().x(10).y(0).width(40).height(50).widget(new ChoroplethStates().testData()))
        ;
        var context = this;
        setInterval(function () {
            context.widgets().sort(function (l, r) {
                if (Math.random() < 0.5) {
                    return -1;
                }
                return 1;
            });
            context.render();
        }, 3000);
        return this;
    };
    
    Layered.prototype.addLayer = function(widget) {
        var widgets = this.widgets();
        widgets.push(widget ? widget : new Text().text("No widget defined for layer."));
        this.widgets(widgets);
        return this;
    };

    Layered.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        this._contentContainer = element.append("div")
            .attr("class", "container")
        ;
    };

    Layered.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        var context = this;

        element.style("padding", this.padding() + "px");

        var content = this._contentContainer.selectAll(".content.id" + this.id()).data(this.widgets(), function (d) { return d.id(); });
        content.enter().append("div")
            .attr("class", "content id" + this.id())
            .each(function (widget, idx) {
                widget.target(this);
            })
        ;
        content
            .each(function (widget, idx) {
                widget.resize({ width: context.clientWidth(), height: context.clientHeight() }).render();
            })
        ;
        content.exit()
            .each(function (widget, idx) {
                widget
                    .target(null)
                ;
            })
            .remove()
        ;
        content.order();
    };

    return Layered;
}));



(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define('layout/Tabbed.js',["d3", "../common/HTMLWidget", "../layout/Surface", "../chart/Pie", "../chart/MultiChart", "../google/Line", "../common/Text", "css!./Tabbed"], factory);
    } else {
        root.form_Form = factory(root.d3, root.common_HTMLWidget, root.layout_Surface, root.chart_Pie, root.chart_MultiChart, root.chart_Line, root.common_Text);
    }
}(this, function (d3, HTMLWidget, Surface, Pie, MultiChart, Line, Text) {
    function Tabbed() {
        HTMLWidget.call(this);

        this._tag = "div";
    }
    Tabbed.prototype = Object.create(HTMLWidget.prototype);
    Tabbed.prototype.constructor = Tabbed;
    Tabbed.prototype._class += " layout_Tabbed";

    Tabbed.prototype.publish("padding", 4, "number", "Padding");
    Tabbed.prototype.publish("activeTabIdx", 0, "number", "Index of active tab", null, {});

    Tabbed.prototype.publish("labels", [], "array", "Array of tab labels sharing an index with 'widgets'", null, { tags: ["Private"] });
    Tabbed.prototype.publish("widgets", [], "widgetArray", "widgets", null, { tags: ["Private"] });

    Tabbed.prototype.testData = function () {
        this
            .addTab(new MultiChart().testData(), "MultiChart", true)
            .addTab(new Pie().testData(), "Pie Chart")
            .addTab(new Line().testData(), "Line Chart")
            .addTab(new Tabbed()
                        .labels([]).widgets([])//TODO:Figure out why this is necessary
                        .addTab(new Pie().testData(), "Another Pie Chart")
                        .addTab(new Line().testData(), "Another Line Chart",true),"Nested Example")
        ;
        return this;
    };
    
    Tabbed.prototype.addTab = function (widget, label, isActive) {
        var labels = this.labels();
        var widgets = this.widgets();
        if (isActive) {
            this.activeTabIdx(this.widgets().length);
        }
        labels.push(label);
        widgets.push(new Surface().widget(widget ? widget : new Text().text("No widget defined for tab")));
        this.labels(labels);
        this.widgets(widgets);
        return this;
    };

    Tabbed.prototype.widgetSize = function (widgetDiv) {
        var width = this.clientWidth();
        var height = this.clientHeight();

        var tcBox = this._tabContainer.node().getBoundingClientRect();
        if(typeof (tcBox.height) !== "undefined"){
            height -= tcBox.height;
        }
        return { width: width, height: height };
    };

    Tabbed.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        this._tabContainer = element.append("div");
        this._contentContainer = element.append("div");
    };

    Tabbed.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        var context = this;

        element.style("padding", this.padding() + "px");

        var tabs = this._tabContainer.selectAll(".tab-button.id" + this.id()).data(this.labels(), function (d) { return d; });
        tabs.enter().append("span")
            .attr("class", "tab-button id" + this.id())
            .style("cursor", "pointer")
            .on("click", function (d, idx) {
                context
                    .activeTabIdx(idx)
                    .render()
                ;
            })
        ;
        tabs
            .classed("active", function (d, idx) { return context.activeTabIdx() === idx; })
            .text(function (d) { return d; })
        ;
        tabs.exit().remove();

        var content = this._contentContainer.selectAll(".tab-content.id" + this.id()).data(this.widgets(), function (d) { return d.id(); });
        content.enter().append("div")
            .attr("class", "tab-content id" + this.id())
            .each(function (widget, idx) {
                widget.target(this);
            })
        ;
        content
            .classed("active", function (d, idx) { return context.activeTabIdx() === idx; })
            .style("display", function (d, idx) { return context.activeTabIdx() === idx ? "block" : "none"; })
            .each(function (widget, idx) {
                var wSize = context.widgetSize(d3.select(this));
                widget.resize(wSize).render();
            })
        ;
        content.exit()
            .each(function (widget, idx) {
                widget
                    .target(null)
                ;
            })
            .remove();
    };

    return Tabbed;
}));

