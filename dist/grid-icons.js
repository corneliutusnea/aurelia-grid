System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GridIcons;
    return {
        setters:[],
        execute: function() {
            GridIcons = (function () {
                function GridIcons() {
                    this.sortingDesc = "glyphicon glyphicon-triangle-top text-primary";
                    this.sortingAsc = "glyphicon glyphicon-triangle-bottom text-primary";
                    this.removeFilter = "glyphicon glyphicon-search text-muted";
                }
                return GridIcons;
            }());
            exports_1("GridIcons", GridIcons);
        }
    }
});
