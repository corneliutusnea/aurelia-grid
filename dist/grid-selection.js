System.register([], function(exports_1) {
    var GridSelection;
    return {
        setters:[],
        execute: function() {
            GridSelection = (function () {
                function GridSelection(grid) {
                    this.grid = grid;
                }
                GridSelection.prototype.select = function (item, event) {
                    // TODO: if multi-selection check event for shift pressed
                    this.grid.selectedItem = item;
                    return true;
                };
                return GridSelection;
            })();
            exports_1("GridSelection", GridSelection);
        }
    }
});
