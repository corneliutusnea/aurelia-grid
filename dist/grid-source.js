System.register([], function(exports_1) {
    var GridDataSource;
    return {
        setters:[],
        execute: function() {
            GridDataSource = (function () {
                function GridDataSource(grid) {
                    this.supportsPagination = false;
                    this.supportsSorting = false;
                    this.supportsMultiColumnSorting = false;
                    this.page = 1;
                    this.pageCount = 0;
                    this.sorting = new Array();
                    this.grid = grid;
                }
                GridDataSource.prototype.attached = function () {
                    this.page = 1;
                    if (this.grid.pager && this.grid.pager.pageSizes)
                        this.pageSize = this.grid.pager.pageSizes[0];
                    else
                        this.pageSize = 10;
                    // process page sizes
                    if (this.grid.sourceAutoLoad) {
                        this.refresh();
                    }
                };
                GridDataSource.prototype.refresh = function () {
                    debugger;
                    throw new Error("Data source does not implement read?");
                };
                GridDataSource.prototype.updatePager = function () {
                    // TODO: 
                };
                GridDataSource.prototype.onData = function () {
                    if (this.pageSize == 0)
                        this.pageSize = 10;
                    this.pageCount = Math.ceil(this.count / this.pageSize);
                    this.grid.pager.refresh();
                };
                GridDataSource.prototype.unbind = function () {
                };
                /** Events from Aurelia */
                GridDataSource.prototype.pageSizeChanged = function (newValue, oldValue) {
                    if (newValue == oldValue)
                        return;
                    this.refresh();
                };
                /** ============ Sorting ============== */
                GridDataSource.prototype.sortChanged = function (column, event) {
                    // Determine new sort
                    var newSort = undefined;
                    // Figure out which way this field should be sorting
                    switch (column.sorting) {
                        case "asc":
                            newSort = "desc";
                            break;
                        case "desc":
                            newSort = "";
                            break;
                        default:
                            newSort = "asc";
                            break;
                    }
                    if (!event.ctrlKey || !this.supportsMultiColumnSorting) {
                        this.sorting.forEach(function (s) { return s.sorting = ""; });
                        this.sorting = [];
                    }
                    column.sorting = newSort;
                    // If the sort is present in the sort stack, slice it to the back of the stack, otherwise just add it
                    var pos = this.sorting.indexOf(column);
                    if (pos > -1)
                        this.sorting.splice(pos, 1);
                    if (newSort)
                        this.sorting.push(column);
                    // Apply the new sort
                    this.refresh();
                };
                return GridDataSource;
            })();
            exports_1("GridDataSource", GridDataSource);
        }
    }
});
