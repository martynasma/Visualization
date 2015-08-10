"use strict";
define(["src/common/Utility"], function (Utility) {
    describe("util", function () {

        var path = "src/common/Utility";

        it("util-naturalSort-test", function (done) {
            require([path], function (Util) {

                var list = ["a","b","c","AA","AB","AB123","CD456",123,456,"111","222"];

                var sortedListA = Util.naturalSort(list,"ascending",null,false);
                var expectedListA = ["111", 123, "222", 456, "a", "AA", "AB", "AB123", "b", "c", "CD456"];

                var sortedListB = Util.naturalSort(list,"descending",null,false);
                var expectedListB = [456, "222", 123, "111", "CD456", "c", "b", "AB123", "AB", "AA", "a"];

                var sortedListC = Util.naturalSort(list,"ascending",null,true);
                var expectedListC = ["111", 123, "222", 456, "AA", "AB", "AB123", "CD456", "a", "b", "c"];

                var sortedListD = Util.naturalSort(list,"descending",null,true);
                var expectedListD = [456, "222", 123, "111", "c", "b", "a", "CD456", "AB123", "AB", "AA"];

                assert.deepEqual(sortedListA,expectedListA);
                assert.deepEqual(sortedListB,expectedListB);
                assert.deepEqual(sortedListC,expectedListC);
                assert.deepEqual(sortedListD,expectedListD);

                done();
            });
        });
    });
});

