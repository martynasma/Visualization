(function(e,t){typeof define=="function"&&define.amd?define(["d3","../common/HTMLWidget","amcharts.gauge","../api/I1DChart"],t):e.amchart_Gauge=t(e.d3,e.common_HTMLWidget,e.AmCharts,e.api_I1DChart)})(this,function(e,t,n,r){function i(){t.call(this),this._tag="div",this._chart={}}return i.prototype=Object.create(t.prototype),i.prototype.constructor=i,i.prototype._class+=" amchart_Gauge",i.prototype.implements(r.prototype),i.prototype.publish("paletteID","default","set","Palette ID",i.prototype._palette.switch(),{tags:["Basic","Shared"]}),i.prototype.publish("low",0,"number","Gauge lower bound",null,{tags:["Intermediate","Shared"]}),i.prototype.publish("high",100,"number","Gauge higher bound",null,{tags:["Intermediate","Shared"]}),i.prototype.publish("fontSize",null,"number","Font Size",null,{tags:["Basic","Shared"]}),i.prototype.publish("fontFamily",null,"string","Font Name",null,{tags:["Basic","Shared","Shared"]}),i.prototype.publish("fontColor",null,"html-color","Font Color",null,{tags:["Basic","Shared"]}),i.prototype.publish("axisLineWidth",1,"number","Thickness of axis",null,{tags:["Intermediate"]}),i.prototype.publish("colorType","a","set","",["a","b","c"],{tags:["Basic"]}),i.prototype.publish("marginLeft",null,"number","Margin (Left)",null,{tags:["Intermediate"]}),i.prototype.publish("marginRight",null,"number","Margin (Right)",null,{tags:["Intermediate"]}),i.prototype.publish("marginTop",null,"number","Margin (Top)",null,{tags:["Intermediate"]}),i.prototype.publish("marginBottom",null,"number","Margin (Bottom)",null,{tags:["Intermediate"]}),i.prototype.publish("numBands",null,"number","",null,{tags:["Intermediate"]}),i.prototype.publish("bandsColor",[],"array","Bands Color",null,{tags:["Basic"]}),i.prototype.publish("bandsStartValue",[],"array","Bands Start Value",null,{tags:["Advanced"]}),i.prototype.publish("bandsEndValue",[],"array","Bands End Value",null,{tags:["Advanced"]}),i.prototype.publish("bandsInnerRadius",[],"array","Bands Inner Radius",null,{tags:["Advanced"]}),i.prototype.publish("axisAlpha",.2,"number","Axis Alpha",null,{tags:["Intermediate"]}),i.prototype.publish("tickAlpha",.2,"number","Tick Alpha",null,{tags:["Intermediate"]}),i.prototype.publish("valueInterval",20,"number","Value Interval",null,{tags:["Advanced"]}),i.prototype.publish("bottomText","","string","Text Along Bottom",null,{tags:["Intermediate"]}),i.prototype.publish("bottomTextYOffset",-20,"number","Bottom Text Vertical Offset",null,{tags:["Intermediate"]}),i.prototype.publish("animatationDuration",2,"number","Animation Duration (sec)",null,{tags:["Intermediate"]}),i.prototype.publish("useClonedPalette",!1,"boolean","Enable or disable using a cloned palette",null,{tags:["Intermediate","Shared"]}),i.prototype.updateChartOptions=function(){this._chart.type="gauge",this._chart.theme="none",this._chart.startDuration=this.animatationDuration(),this._chart.color=this.fontColor(),this._chart.fontSize=this.fontSize(),this._chart.fontFamily=this.fontFamily(),this._chart.titles=[],this._chart.allLabels=[],this.marginLeft()&&(this._chart.marginLeft=this.marginLeft()),this.marginRight()&&(this._chart.marginRight=this.marginRight()),this.marginTop()&&(this._chart.marginTop=this.marginTop()),this.marginBottom()&&(this._chart.marginBottom=this.marginBottom()),this._chart.axes[0].axisThickness=this.axisLineWidth(),this._chart.axes[0].axisAlpha=this.axisAlpha(),this._chart.axes[0].tickAlpha=this.tickAlpha(),this._chart.axes[0].valueInterval=this.valueInterval(),this._chart.axes[0].bands=[],this._chart.axes[0].bottomText=this.bottomText(),this._chart.axes[0].bottomTextYOffset=this.bottomTextYOffset(),this._chart.axes[0].endValue=this.high(),this._chart.axes[0].startValue=this.low();var e,t;if(this.colorType()==="a")for(e=0,t=this.numBands();e<t;e++){var n={color:this.bandsColor()[e],startValue:this.bandsStartValue()[e],endValue:this.bandsEndValue()[e],innerRadius:this.bandsInnerRadius()[e]};this._chart.axes[0].bands.push(n)}if(this.colorType()==="b")for(e=0,t=this.high();e<t;e++){var r={color:this._palette(e,this.low(),this.high()),startValue:e,endValue:e+1,innerRadius:this.bandsInnerRadius()[0]};this._chart.axes[0].bands.push(r)}if(this.colorType()==="c"){var i={color:this._palette(this._data,this.low(),this.high()),startValue:this.low(),endValue:this.high(),innerRadius:this.bandsInnerRadius()[0]};this._chart.axes[0].bands.push(i)}return this._chart.axes[0].bottomText=this.bottomText().replace("[[data]]",this._data),this._chart},i.prototype.update=function(e,t){this._palette=this._palette.switch(this.paletteID()),this.useClonedPalette()&&(this._palette=this._palette.cloneNotExists(this.paletteID()+"_"+this.id())),e.style.width=this.size().width+"px",e.style.height=this.size().height+"px",this.updateChartOptions(),this._chart.arrows[0].setValue(this._data),this._chart.validateNow(),this._chart.validateData()},i.prototype.enter=function(e,t){e.style.width=this.size().width+"px",e.style.height=this.size().height+"px";var r={theme:"none",type:"gauge",axes:[{}],arrows:[{}]};this._chart=n.makeChart(e,r)},i.prototype.testData=function(){return this.numBands(3),this.bandsColor(["#84b761","#fdd400","#cc4748"]),this.bandsEndValue([90,130,220]),this.bandsStartValue([0,90,130]),this.bandsInnerRadius([null,null,"95%"]),this.bottomText("[[data]] km/h"),this.high(220),this.low(0),this.data(100),this.axisLineWidth(1),this.axisAlpha(.2),this.tickAlpha(.2),this.valueInterval(20),this},i});