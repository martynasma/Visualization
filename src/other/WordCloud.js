/**
* @file HPCC VIZ WordCloud Widget
* @author HPCC Systems
*/

"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/SVGWidget", "./IWordCloud", "require", "css!./WordCloud"], factory);
    } else {
        root.other_WordCloud = factory(root.d3, root.common_SVGWidget, root.other_IWordCloud, root.require);
    }
}(this, function (d3, SVGWidget, IWordCloud, require) {
    /**
     * @class other_WordCloud
     * @extends common_SVGWidget
     * @implements other_IWordCloud
     */
    function WordCloud() {
        SVGWidget.call(this);
        IWordCloud.call(this);
    }
    WordCloud.prototype = Object.create(SVGWidget.prototype);
    WordCloud.prototype.implements(IWordCloud.prototype);
    /**
     * Specifies the class name of the container.
     * @member {string} _class
     * @memberof other_WordCloud
     * @private
     */
    WordCloud.prototype._class += " other_WordCloud";

    WordCloud.prototype.publish("padding", 1, "number", "Padding",null,{tags:['Intermediate']});
    WordCloud.prototype.publish("fontFamily", "Verdana", "string", "Font Name",null,{tags:['Basic']});
    WordCloud.prototype.publish("fontSizeFrom", 6, "number", "Font Size From",null,{tags:['Basic']});
    WordCloud.prototype.publish("fontSizeTo", 24, "number", "Font Size To",null,{tags:['Basic']});
    WordCloud.prototype.publish("angleFrom", -60, "number", "Angle From",null,{tags:['Basic']});
    WordCloud.prototype.publish("angleTo", 60, "number", "Angle To",null,{tags:['Basic']});
    WordCloud.prototype.publish("angleCount", 5, "number", "Angle Count",null,{tags:['Basic']});

    /**
     * Sets data to be render within widget.
     * @method data
     * @memberof other_WordCloud
     * @instance
     * @param {Mixed} _ The data being rendered.
     * @returns {Widget}
     * @example TODO
     */
    WordCloud.prototype.data = function (_) {
        var retVal = SVGWidget.prototype.data.apply(this, arguments);
        if (arguments.length) {
            this._vizData = _.map(function (row) {
                var retVal = {};
                for (var key in row) {
                    retVal["__viz_" + key] = row[key];
                }
                return retVal;
            });
        }
        return retVal;
    };

    /**
     * The function that is called when this widget "enters" the web page.
     * @method enter
     * @memberof other_WordCloud
     * @instance
     * @protected
     * @param {HTMLElement} domeNode HTML DOMNode of widget container.
     * @param {D3Selection} element d3 selection object of widget.
     */
    WordCloud.prototype.enter = function (domNode, element) {
        this.cloud = d3.layout.cloud()
            .font(this.fontFamily())
            .padding(this.padding())
        ;
        this.svg = element.append("g");
    };


    /**
     * The function that is called when this widget "enters" the web page. after enter() and everytime the widget is updated with subsequent render calls.
     * @method update
     * @memberof other_WordCloud
     * @instance
     * @protected
     * @param {HTMLElement} domeNode HTML/SVG DOMNode of widget container.
     * @param {D3Selection} element d3 selection object of widget.
     */
    WordCloud.prototype.update = function (domNode, element) {
        var context = this;
        var extent = d3.extent(this._vizData, function (d) {
            return d.__viz_1;
        });
        var scale = d3.scale.log().domain(extent).range([this.fontSizeFrom(), this.fontSizeTo()]);

        var angleDomain = d3.scale.linear().domain([0, context.angleCount() - 1]).range([context.angleFrom(), context.angleTo()]);

        this.cloud
            .size([this.width(), this.height()])
            .words(this._vizData)
            .rotate(function () {
                return angleDomain(~~(Math.random() * context.angleCount()));
            })
            .fontSize(function (d) {
                return scale(d.__viz_1);
            })
            .on("end", draw)
            .start()
        ;

        function draw(data, bounds) {
            var fill = d3.scale.category20();
            var text = context.svg.selectAll("text")
                .data(data, function (d) { return d.__viz_0 ? d.__viz_0.toLowerCase() : ""; })
            ;
            text.transition()
                .duration(1000)
                .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                .style("font-size", function (d) {
                    return scale(d.__viz_1) + "px";
                })
                .style("opacity", 1)
            ;
            text.enter().append("text")
                .attr("text-anchor", "middle")
                .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                .style("font-size", function(d) {
                    return scale(d.__viz_1) + "px";
                })
                .style("font-family", function (d) { return d.fontFamily; })
                .style("fill", function (d) { return fill(d.__viz_0 ? d.__viz_0.toLowerCase() : ""); })
                .text(function (d) { return d.__viz_0; })
                .on("click", function (d) {
                    context.click({label:  d.__viz_0, weight: d.__viz_1});
                })
                .style("opacity", 1e-6)
              .transition()
                .duration(1000)
                .style("opacity", 1)
            ;

            text.exit().transition().duration(1000)
                .style("opacity", 1e-4)
                .remove()
            ;

            if (bounds) {
                var w = context.width();
                var h = context.height();
                var dx = bounds[1].x - bounds[0].x,
                    dy = bounds[1].y - bounds[0].y,
                    borderScale = 0.9 / Math.max(dx / w, dy / h);
                context.svg.transition().delay(1000).duration(750)
                    .attr("transform", "scale(" + borderScale + ")")
                ;
            }
        }
    };

    /**
     * An optional callback function as parameter. The current widget object being operated on is passed to the function. The function will execute ater the widget has completed rendering.
     * @name WordCloud~RenderCb
     * @function
     * @param {Widget} widget - The rendered widget.
     * @return undefined
     */

    /**
     * Renders widget in target container immediately.
     * @method render
     * @memberof other_WordCloud
     * @instance
     * @param {WordCloud~RenderCb} [callback] - The callback function that is executed after widget render.
     * @returns {Widget}
     * @example <caption>Example usage of render.</caption>
     * var w = new Widget.target("divID").render(function(widget) { console.log(widget); });
     */
    WordCloud.prototype.render = function (callback) {
        var context = this;
        require(["d3.layout.cloud"], function (d3LayoutClout) {
            SVGWidget.prototype.render.call(context, callback);
        });
        return this;
    };

    return WordCloud;
}));
