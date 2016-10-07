System.register([], function(exports_1) {
    var GridIcons;
    return {
        setters:[],
        execute: function() {
            GridIcons = (function () {
                function GridIcons() {
                    this.refresh = "fa fa-refresh";
                    this.sortingAsc = "fa fa-sort-asc text-primary";
                    this.sortingDesc = "fa fa-sort-desc text-primary";
                    this.firstPage = "fa fa-step-backward";
                    this.firstPageTitle = "First page";
                    this.prevPage = "fa fa-caret-left";
                    this.prevPageTitle = "Previous page";
                    this.nextPage = "fa fa-caret-right";
                    this.nextPageTitle = "Next page";
                    this.lastPage = "fa fa-step-forward";
                    this.lastPageTitle = "Last page";
                }
                return GridIcons;
            })();
            exports_1("GridIcons", GridIcons);
        }
    }
});
