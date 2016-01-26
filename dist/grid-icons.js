System.register([], function(exports_1) {
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
            })();
            exports_1("GridIcons", GridIcons);
        }
    }
});
