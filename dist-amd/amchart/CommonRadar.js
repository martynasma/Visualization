(function(e,t){typeof define=="function"&&define.amd?define(["d3","../common/HTMLWidget","amcharts.radar"],t):e.amchart_CommonRadar=t(e.d3,e.common_HTMLWidget,e.AmCharts)})(this,function(e,t,n){function r(){t.call(this),this._tag="div",this._chart={}}return r.prototype=Object.create(t.prototype),r.prototype.constructor=r,r.prototype._class+=" amchart_CommonRadar",r.prototype.publish("fontSize",null,"number","Font Size",null,{tags:["Basic","Shared"]}),r.prototype.publish("fontFamily",null,"string","Font Name",null,{tags:["Basic","Shared"]}),r.prototype.publish("fontColor",null,"html-color","Font Color",null,{tags:["Basic","Shared"]}),r.prototype.publish("lineWidth",2,"number","Line Thickness",null,{min:0,max:10,step:1,inputType:"range",tags:["Basic","Shared"]}),r.prototype.publish("lineOpacity",1,"number","Line Opacity",null,{min:0,max:1,step:.001,inputType:"range",tags:["Basic","Shared"]}),r.prototype.publish("dashedLineStyle",0,"number","",null,{tags:["Advanced","Shared"]}),r.prototype.publish("yAxisBaselineColor",null,"html-color","Axis color",null,{tags:["Intermediate","Shared"]}),r.prototype.publish("axisFontSize",null,"number","Size of value labels text. Will use chart's fontSize if not set.",null,{tags:["Basic","Shared"]}),r.prototype.publish("yAxisFontColor",null,"string","Font Name",null,{tags:["Basic","Shared"]}),r.prototype.publish("yAxisTitle","","string","Y-Axis Title",null,{tags:["Basic","Shared"]}),r.prototype.publish("yAxisTitleFontColor",null,"html-color","Color of axis value labels. Will use chart's color if not set.",null,{tags:["Basic","Shared"]}),r.prototype.publish("yAxisTitleFontSize",null,"html-color","Font Size of axis value labels. Will use chart's color if not set.",null,{tags:["Basic","Shared"]}),r.prototype.publish("axisLineWidth",1,"number","Thickness of axis",null,{tags:["Basic","Shared"]}),r.prototype.publish("marginLeft",null,"number","Margin (Left)",null,{tags:["Intermediate"]}),r.prototype.publish("marginRight",null,"number","Margin (Right)",null,{tags:["Intermediate"]}),r.prototype.publish("marginTop",null,"number","Margin (Top)",null,{tags:["Intermediate"]}),r.prototype.publish("marginBottom",null,"number","Margin (Bottom)",null,{tags:["Intermediate"]}),r.prototype.publish("showScrollbar",!1,"boolean","Chart Scrollbar",null,{tags:["Intermediate"]}),r.prototype.publish("startDuration",.3,"number","Start Duration (sec)",null,{tags:["Private"]}),r.prototype.publish("dataDateFormat",null,"string","Date Format String",null,{tags:["Private"]}),r.prototype.publish("yAxisAutoGridCount",!0,"boolean","Specifies whether number of gridCount is specified automatically, acoarding to the axis size",null,{tags:["Advanced"]}),r.prototype.publish("yAxisGridPosition","start","set","Specifies if a grid line is placed on the center of a cell or on the beginning of a cell",["start","middle"],{tags:["Advanced"]}),r.prototype.publish("yAxisMinimum",[],"array","",null,{tags:["Advanced"]}),r.prototype.publish("yAxisTitleOffset",[],"array","",null,{tags:["Advanced"]}),r.prototype.publish("yAxisDashLength",[],"array","Length of a dash. 0 means line is not dashed.",null,{tags:["Advanced"]}),r.prototype.publish("axisAlpha",1,"number","Axis opacity",null,{tags:["Intermediate"]}),r.prototype.publish("circularGrid",!1,"boolean","Circular Grid",null,{tags:["Intermediate"]}),r.prototype.publish("bulletSize",9,"number","Bullet Size",null,{tags:["Intermediate"]}),r.prototype.publish("bulletType","round","set","Bullet Type",["none","round","square","triangleUp","triangleDown","triangleLeft","triangleRight","bubble","diamond"],{tags:["Intermediate"]}),r.prototype.publish("fillOpacity",.3,"number","Shape Opacity",null,{min:0,max:1,step:.001,inputType:"range",tags:["Intermediate"]}),r.prototype.publish("useClonedPalette",!1,"boolean","Enable or disable using a cloned palette",null,{tags:["Intermediate","Shared"]}),r.prototype.updateChartOptions=function(){var e=this;return this.dataDateFormat()&&(this._chart.dataDateFormat=this.dataDateFormat()),this._chart.theme="none",this._chart.type="radar",this._chart.startDuration=this.startDuration(),this._chart.categoryField=this._categoryField,this._chart.color=this.fontColor(),this._chart.fontSize=this.fontSize(),this._chart.fontFamily=this.fontFamily(),this.marginLeft()&&(this._chart.marginLeft=this.marginLeft()),this.marginRight()&&(this._chart.marginRight=this.marginRight()),this.marginTop()&&(this._chart.marginTop=this.marginTop()),this.marginBottom()&&(this._chart.marginBottom=this.marginBottom()),this.titles=[],this._chart.dataProvider=this.formatData(this._data),this._chart.valueAxes[0].title=this.yAxisTitle(),this._chart.valueAxes[0].axisTitleOffset=this.yAxisTitleOffset(),this._chart.valueAxes[0].minimum=this.yAxisMinimum(),this._chart.valueAxes[0].axisAlpha=this.axisAlpha(),this._chart.valueAxes[0].dashLength=this.yAxisDashLength()||this.dashedLineStyle(),this._chart.valueAxes[0].axisColor=this.yAxisBaselineColor(),this._chart.valueAxes[0].axisThickness=this.axisLineWidth(),this._chart.valueAxes[0].titleColor=this.yAxisTitleFontColor(),this._chart.valueAxes[0].titleFontSize=this.yAxisTitleFontSize(),this._chart.valueAxes[0].fontSize=this.axisFontSize(),this._chart.valueAxes[0].color=this.yAxisFontColor(),this._chart.valueAxes[0].autoGridCount=this.yAxisAutoGridCount(),this._chart.valueAxes[0].gridPosition=this.yAxisGridPosition(),this._chart.colors=this._columns.filter(function(e,t){return t>0}).map(function(e){return this._palette(e)},this),this.circularGrid()&&this._chart.valueAxes.forEach(function(t,n){e._chart.valueAxes[n].gridType="circles"}),this.showScrollbar()?this._chart.chartScrollbar.enabled=!0:this._chart.chartScrollbar.enabled=!1,this._chart},r.prototype.buildGraphObj=function(e,t){var n=this,r={};return r.balloonText=n.tooltipTemplate(),r.fillAlphas=n.fillOpacity(),r.lineAlpha=n.lineOpacity(),r.lineThickness=n.lineWidth(),r.bullet=n.bulletType(),r.bulletSize=n.bulletSize(),r.dashLength=n.dashedLineStyle(),r.type=e,r.title="",r},r.prototype.formatData=function(e){var t=[],n=this;return e.forEach(function(e){var r={};n._columns.forEach(function(t,n){r[t]=e[n]}),t.push(r)}),t},r.prototype.columns=function(e){if(!arguments.length)return this._columns;var n=this,r=t.prototype.columns.apply(this,arguments);return arguments.length?(this._categoryField=e[0],this._valueField=[],e.slice(1,e.length).forEach(function(e){n._valueField.push(e)}),this._columns=e,this):r},r.prototype.enter=function(e,r){t.prototype.enter.apply(this,arguments);var i=this,s={theme:"none",type:"radar",chartScrollbar:{}};this._chart=n.makeChart(e,s),this._chart.addListener("clickGraphItem",function(e){i.click(i.rowToObj(i._data[e.index]),i._columns[e.target.index+1])})},r.prototype.update=function(e,n){t.prototype.update.apply(this,arguments),e.style.width=this.size().width+"px",e.style.height=this.size().height+"px",this._palette=this._palette.switch(this.paletteID()),this.useClonedPalette()&&(this._palette=this._palette.cloneNotExists(this.paletteID()+"_"+this.id()))},r});