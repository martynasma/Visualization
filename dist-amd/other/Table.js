(function(e,t){typeof define=="function"&&define.amd?define(["d3","../common/HTMLWidget","../other/Paginator","../other/Bag","css!./Table"],t):e.other_Table=t(e.d3,e.common_HTMLWidget,e.other_Paginator,e.other_Bag)})(this,function(e,t,n,r){function i(){t.call(this),this._tag="div",this._currentSort="",this._currentSortOrder=1,this._columns=[],this._paginator=new n,this._selectionBag=new r.Selection,this._selectionPrevClick=null}return i.prototype=Object.create(t.prototype),i.prototype.constructor=i,i.prototype._class+=" other_Table",i.prototype.testData=function(){return this.columns(["Lat","Long","Pin"]).data([[37.665074,-122.384375,"green-dot.png"],[32.69068,-117.17854],[39.709455,-104.969859],[41.244123,-95.96161],[32.68898,-117.19204],[45.78649,-108.5266],[45.79618,-108.535652],[45.77432,-108.49437],[45.777062,-108.549835,"red-dot.png"]]),this},i.prototype.publish("pagination",!1,"boolean","enable or disable pagination",null,{tags:["Private"]}),i.prototype.publishProxy("itemsPerPage","_paginator"),i.prototype.publishProxy("pageNumber","_paginator","pageNumber",1),i.prototype.enter=function(e,n){t.prototype.enter.apply(this,arguments),this._parentElement.style("overflow","auto"),this.table=n.append("table"),this.thead=this.table.append("thead").append("tr"),this.tbody=this.table.append("tbody")},i.prototype._generateTempCell=function(){var e=this.tbody.selectAll("tr").data([[0]]);e.enter().append("tr");var t=e.selectAll("td").data(function(e,t){return e});return t.enter().append("td").text(function(e){return e}),t.exit().remove(),t},i.prototype._createSelectionObject=function(e){var t=this;return{_id:e,element:function(){return t.tbody.selectAll("tr").filter(function(t){return t===e})}}},i.prototype._calcRowsPerPage=function(e){this._paginator.numItems()===0&&(this._paginator.numItems(1),this.itemsPerPage(1),this._paginator.render());var t=this.calcHeight(e),n=this.calcHeight(this._generateTempCell()),r=this.calcHeight(this._paginator.element()),i=Math.ceil((this.height()-t-r)/n)||1;return i},i.prototype.update=function(n,r){t.prototype.update.apply(this,arguments);var i=this,s=this.thead.selectAll("th").data(this._columns,function(e){return e});s.enter().append("th").each(function(t){var n=e.select(this);n.append("span").attr("class","thText"),n.append("span").attr("class","thIcon")}).on("click",function(e){i.headerClick(e)}),s.select(".thText").text(function(e){return e}),s.select(".thIcon").text(function(e){return i._currentSortOrder===-1?i._currentSort===e?"":"":i._currentSort===e?"":""}),s.exit().remove();if(this.pagination()){this._paginator.target()===null&&this._paginator.target(n);var o=this._calcRowsPerPage(s);this.itemsPerPage(o),this._paginator.numItems(this._data.length),this._tNumPages=Math.ceil(this._paginator.numItems()/this.itemsPerPage())||1,this.pageNumber()>this._tNumPages&&this.pageNumber(1),this._paginator._onSelect=function(e,t){console.log("page: "+e),i.pageNumber(e),i.render();return}}else this._paginator.numItems(0);var u=this.pageNumber()-1,a=this.itemsPerPage(),f=u*a,l=parseInt(u*a)+parseInt(a),c=null;this.pagination()?c=this._data.slice(f,l):c=this._data;var h=this.tbody.selectAll("tr").data(c);h.enter().append("tr").on("click.selectionBag",function(e){i.selectionBagClick(e),i.render()}).on("click",function(e){i.click(i.rowToObj(e))}),h.attr("class",function(e){if(i._selectionBag.isSelected(i._createSelectionObject(e)))return"selected"}),h.exit().remove();var p=h.selectAll("td").data(function(e,t){return e});p.enter().append("td"),p.text(function(e){return e instanceof String?e.trim():e instanceof Object?"":e}),p.exit().remove(),this._paginator.render()},i.prototype.exit=function(e,n){this._paginator.target(null),t.prototype.exit.apply(this,arguments)},i.prototype.headerClick=function(e){var t=this;this._currentSort!==e?(this._currentSort=e,this._currentSortOrder=1):this._currentSortOrder*=-1;var n=this._columns.indexOf(e);this._data.sort(function(e,r){return e[n]===r[n]?0:typeof r[n]=="undefined"||e[n]>r[n]?t._currentSortOrder:t._currentSortOrder*-1}),this.render()},i.prototype.selection=function(e){return arguments.length?(this._selectionBag.set(e.map(function(e){return this._createSelectionObject(e)},this)),this):this._selectionBag.get().map(function(e){return e._id})},i.prototype.selectionBagClick=function(t){if(e.event.shiftKey){var n=!1,r=this._data.filter(function(e){var r=!1;if(e===t||e===this._selectionPrevClick)n&&(r=!0),n=!n;return n||r},this);this.selection(r)}else this._selectionBag.click(this._createSelectionObject(t),e.event),this._selectionPrevClick=t},i.prototype.click=function(e,t){console.log("Click:  "+JSON.stringify(e)+", "+t)},i});