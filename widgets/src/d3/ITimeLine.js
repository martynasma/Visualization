"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../common/Palette"], factory);
    } else {
        root.ITimeLine = factory(root.Palette);
    }
}(this, function (Palette) {
    function ITimeLine() {
    };

    ITimeLine.prototype._palette = Palette.ordinal("default");

    ITimeLine.prototype.testData = function (option) {
        var ta = {};
        ta['testData'] = [
            {times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
            {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]},
        ];
        
        ta['testDataWithColor'] = [
            {
                label: "fruit 1", fruit: "orange", times: [ {"starting_time": 1355759910000, "ending_time": 1355761900000} ]
            },
            {
                label: "fruit 2", fruit: "apple", times: [ {"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000} ]
            },
            {
                label: "fruit3", fruit: "lemon", times: [ {"starting_time": 1355761910000, "ending_time": 1355763910000} ]
            }
        ];

        ta['labelTestData'] = [
            {label: "person a", times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {label: "person b", times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
            {label: "person c", times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]},
        ];

        ta['iconTestData'] = [
            {icon: "jackie.png", times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {icon: "troll.png", times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
            {icon: "wat.png", times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]},
        ];

        ta['labelColorTestData'] = [
            {label: "person a", times: [{"color":"green", "label":"Weeee", "starting_time": 1355752800000, "ending_time": 1355759900000}, {"color":"blue", "label":"Weeee", "starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {label: "person b", times: [{"color":"pink", "label":"Weeee", "starting_time": 1355759910000, "ending_time": 1355761900000}, ]},
            {label: "person c", times: [{"color":"yellow", "label":"Weeee", "starting_time": 1355761910000, "ending_time": 1355763910000}]},
        ];

        ta['testDataRelative'] = [
            {times: [{"starting_time": 1355752800000, "ending_time": 1355759900000}, {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
            {times: [{"starting_time": 1355759910000, "ending_time": 1355761900000}]},
            {times: [{"starting_time": 1355761910000, "ending_time": 1355763910000}]},
        ];

        this.data(ta[option] || ta['testDataWithColor']);
        return this;
    };

    //  Properties  ---

    //  Events  ---
    ITimeLine.prototype.click = function (d) {
        console.log("Click:  " + d.label);
    };

    return ITimeLine;
}));
