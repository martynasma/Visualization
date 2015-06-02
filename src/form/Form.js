"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../common/HTMLWidget", "css!./Form"], factory);
    } else {
        root.form_Form = factory(root.common_HTMLWidget);
    }
}(this, function (HTMLWidget) {
    function Form() {
        HTMLWidget.call(this);
        this._class = "form_Form";

        this._tag = "form";
    };
    Form.prototype = Object.create(HTMLWidget.prototype);

    Form.prototype.testData = function (widget) {
        this
            .columns([{
                id: "subject",
                label: "Subject",
                type: "string",  //  If ommitted should default to string  ---
                validate: "[A-Za-z]"
            }, {
                id: "result",
                label: "Result",
                type: "number",
                validate: "\\d+"
            }, {
                id: "fail",
                label: "Failed?",
                type: "boolean",
                validate: "(true|false)"
            }])
            .data([["Geography", 66, false]])
        ;
        return this;
    }

    Form.prototype.rowToObj = function (row) {
        var retVal = {};
        if (row.length !== this._columns.length) {
            throw "Columns and row do not match";
        }
        this._columns.forEach(function (col, idx) {
            retVal[col.id] = row[idx];
        });
        return retVal;
    };


    Form.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);

        this._parentElement.style("overflow", "auto");
        var table = element
            .append("table")
        ;
        this.tbody = table.append("tbody");
        var btntd = table.append("tfoot").append("tr").append('td')
            .attr('colspan', "2")
            .append("div")
                .style("float", "right")
        ;

        var context = this;
        btntd.append('input')
             .attr('type', 'button')
             .attr('value', 'Submit')
             .on('click', function (d) {
                 if (context._validate(context.rowToObj(context._data[0]))) {
                    context.click(context.rowToObj(context._data[0]));
                 } else {
                    console.log("validation failed");
                 }
             })
        ;
        btntd.append('input')
             .attr('type', 'button')
             .attr('value', 'Cancel')
             .on('click', function (d) {
                 context.click();
             })
        ;

    };

    Form.prototype._validate = function(context) {
        return this.columns().every(function(d, i) {
            var valStr = d.validate;
            var re = new RegExp(valStr);
            if (valStr) {
                if (!re.test(context[d.id])) {
                    return false;
                }
                else {
                    return true;
                }
            } else {
                return true;
            }
        });
    };

    Form.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        var context = this;

        var rows = this.tbody.selectAll("tr").data(this._columns, function (d) { return d.id; });
        rows.enter().append("tr")
            .each(function (d, i) {
                var element = d3.select(this);
                var td = element.append("td")
                    .text(d.label)
                ;
                var input = element.append("td")
                    .append("input")
                ;
                switch (d.type) {
                    case "number":
                        input.attr("type", "number");
                        break;
                    case "boolean":
                        input.attr("type", "checkbox");
                        break;
                    case "string":
                    default:
                        input.attr("type", "textbox");
                        break;
                }
                switch (d.type) {
                    case "boolean":
                        input
                            .attr("checked", context._data[0][i])
                            .on("click", function (d, i) {
                                var colIdx = context._columns.indexOf(d);
                                context._data[0][colIdx] = this.checked;
                            })
                        ;
                        break;
                    case "string":
                    case "number":
                    default:
                        input
                            .attr("value", context._data[0][i])
                            .on("change", function (d, i) {
                                var colIdx = context._columns.indexOf(d)
                                context._data[0][colIdx] = this.value;
                            })
                        ;
                        break;
                }
            })
        ;
        rows.exit().remove();
    };

    Form.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    Form.prototype.click = function (row) {
        console.log("Click:  " + JSON.stringify(row));
    };

    return Form;

}));