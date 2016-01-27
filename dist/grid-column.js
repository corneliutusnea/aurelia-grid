System.register([], function(exports_1) {
    var GridColumn;
    return {
        setters:[],
        execute: function() {
            /** All Attributes on <grid-col  */
            GridColumn = (function () {
                function GridColumn() {
                }
                GridColumn.prototype.init = function () {
                    // we can accept the field to be null if the column has no sorting enabled
                    if (this.canSort) {
                        if (!this.field) {
                            throw new Error("field is required for column " + this.heading + " if the column is sortable.");
                        }
                    }
                    if (this.canFilter && !this.filterPlaceholder)
                        this.filterPlaceholder = "filter...";
                };
                return GridColumn;
            })();
            exports_1("GridColumn", GridColumn);
        }
    }
});
