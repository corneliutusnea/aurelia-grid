System.register([], function(exports_1) {
    var GridColumn;
    return {
        setters:[],
        execute: function() {
            /** All Attributes on <grid-col  */
            GridColumn = (function () {
                function GridColumn() {
                    this.heading = "";
                    this.field = "";
                    this.class = "";
                    this.headerClass = "";
                    this.canSort = false;
                    this.canFilter = false;
                    this.filterPlaceholder = "";
                    /** Value for filtering */
                    this.filterValue = "";
                    this.sorting = ""; // asc|desc
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
