System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
                };
                return GridSelection;
            }());
            exports_1("GridSelection", GridSelection);
        }
    }
});
