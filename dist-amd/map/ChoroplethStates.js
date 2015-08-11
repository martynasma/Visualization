(function(e,t){typeof define=="function"&&define.amd?define(["d3","./Choropleth","topojson","./us-states"],t):e.map_ChoroplethStates=t(e.d3,e.map_Choropleth,e.topojson,e.map_usStates)})(this,function(e,t,n,r){function i(){t.call(this),this.projection("albersUsaPr")}return i.prototype=Object.create(t.prototype),i.prototype.constructor=i,i.prototype._class+=" map_ChoroplethStates",i.prototype.testData=function(){var e={};for(var t in r.stateNames){var n=r.stateNames[t];e[n.name]=n.code}var i=[{name:"Alabama",weight:4779736},{name:"Alaska",weight:710231},{name:"Arizona",weight:6392017},{name:"Arkansas",weight:2915918},{name:"California",weight:37253956},{name:"Colorado",weight:5029196},{name:"Connecticut",weight:3574097},{name:"District of Columbia",weight:601723},{name:"Florida",weight:18801310},{name:"Georgia",weight:9687653},{name:"Hawaii",weight:1360301},{name:"Idaho",weight:1567582},{name:"Illinois",weight:12830632},{name:"Indiana",weight:6483802},{name:"Iowa",weight:3046355},{name:"Maine",weight:1328361},{name:"Maryland",weight:5773552},{name:"Massachusetts",weight:6547629},{name:"Michigan",weight:9883640},{name:"Minnesota",weight:5303925},{name:"Mississippi",weight:2967297},{name:"Missouri",weight:5988927},{name:"Montana",weight:989415},{name:"Nebraska",weight:1826341},{name:"Nevada",weight:2700551},{name:"New Hampshire",weight:1316470},{name:"New Jersey",weight:8791894},{name:"New Mexico",weight:2059179},{name:"New York",weight:19378102},{name:"North Carolina",weight:9535483},{name:"North Dakota",weight:672591},{name:"Ohio",weight:11536504},{name:"Oklahoma",weight:3751351},{name:"Oregon",weight:3831074},{name:"Pennsylvania",weight:12702379},{name:"Rhode Island",weight:1052567},{name:"South Carolina",weight:4625364},{name:"South Dakota",weight:814180},{name:"Tennessee",weight:6346105},{name:"Texas",weight:25145561},{name:"Utah",weight:2763885},{name:"Vermont",weight:625741},{name:"Virginia",weight:8001024},{name:"Washington",weight:6724540},{name:"West Virginia",weight:1852994},{name:"Wisconsin",weight:5686986},{name:"Wyoming",weight:563626}];this.columns(["State","Weight","Label"]);var s=i.map(function(t){return[e[t.name],t.weight,t.name]});return this.data(s),this},i.prototype.enter=function(i,s){t.prototype.enter.apply(this,arguments),s.classed("map_Choropleth",!0);var o=this._svg.selectAll("path").data(n.feature(r.topology,r.topology.objects.states).features),u=this;this.choroPaths=o.enter().append("path").on("click",function(e){var t=r.stateNames[e.id].code;u._dataMap[t]&&u.click(u.rowToObj(u._dataMap[t]),"weight")}).on("dblclick",function(t){e.event.stopPropagation(),u.zoomToFit(u.active===this?null:this,750),u.active=this}),this.choroPaths.append("title")},i.prototype.update=function(n,i){t.prototype.update.apply(this,arguments);var s=this;this.choroPaths.attr("d",this.d3Path).each(function(t){var n=r.stateNames[t.id].code,i=s._dataMap[n]?s._dataMap[n][1]:undefined;e.select(this).style("fill",i===undefined?"url(#hash)":s._palette(i,s._dataMinWeight,s._dataMaxWeight)).select("title").text(r.stateNames[t.id].name+(i===undefined?"":" ("+i+")"))})},i});