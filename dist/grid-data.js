System.register([], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var GridDataSource, LocalGridData;
    return {
        setters:[],
        execute: function() {
            GridDataSource = (function () {
                function GridDataSource(grid) {
                    this.page = 1;
                    this.sorting = {};
                    this.sortProcessingOrder = new Array();
                    this.grid = grid;
                }
                GridDataSource.prototype.attached = function () {
                    this.page = 1;
                    this.pageSize = this.grid.sourcePageSizes[0];
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
                GridDataSource.prototype.unbind = function () {
                };
                return GridDataSource;
            })();
            exports_1("GridDataSource", GridDataSource);
            /** Local Source of Grid Data - In Memory Paging and Sorting */
            LocalGridData = (function (_super) {
                __extends(LocalGridData, _super);
                function LocalGridData(grid) {
                    _super.call(this, grid);
                    this.dataRead = grid.sourceRead;
                    if (!this.dataRead) {
                        throw new Error("'data-read.call' is not defined on the grid.");
                    }
                }
                LocalGridData.prototype.refresh = function () {
                    var _this = this;
                    this.loading = true;
                    this.dataRead({
                        page: this.page,
                        pageSize: this.pageSize
                    }).then(function (result) {
                        _this.handleResult(result);
                        _this.loading = false;
                    }).catch(function (error) {
                        if (_this.grid.sourceReadError)
                            _this.grid.sourceReadError(error);
                        _this.loading = false;
                    });
                };
                /** ============ New Data ============== */
                LocalGridData.prototype.handleResult = function (result) {
                    var r;
                    if (this.grid.sourceTransform)
                        r = this.grid.sourceTransform(result);
                    else
                        r = result;
                    if (r) {
                        this.allItems = r.data;
                        this.cache = this.allItems;
                        this.count = r.count;
                        this.filterAndSortLocalData();
                    }
                };
                LocalGridData.prototype.filterAndSortLocalData = function () {
                    var _this = this;
                    // Applies filter, sort then page
                    // 1. First filter the data down to the set we want, if we are using local data
                    var tempData = this.allItems;
                    if (this.grid.columnsCanFilter)
                        tempData = this.applyFilter(tempData);
                    // 2. Now sort the data
                    if (this.grid.columnsCanSort)
                        tempData = this.applySort(tempData);
                    // 3. Now apply paging
                    if (this.grid.sourceCanPage)
                        tempData = this.applyPage(tempData);
                    this.items = tempData;
                    this.updatePager();
                    this.watchForChanges();
                    setTimeout(function () { return _this.grid.builder.headersSyncColumnHeadersWithColumns.bind(_this); }, 0);
                };
                /** ============ Filtering ============== */
                LocalGridData.prototype.applyFilter = function (data) {
                    var _this = this;
                    return data.filter(function (row) {
                        var include = true;
                        for (var i = _this.grid.template.columns.length - 1; i >= 0; i--) {
                            var col = _this.grid.template.columns[i];
                            if (col.filterValue !== "" && row[col.field].toString().indexOf(col.filterValue) === -1) {
                                include = false;
                            }
                        }
                        return include;
                    });
                };
                LocalGridData.prototype.getFilterColumns = function () {
                    var cols = {};
                    for (var i = this.grid.template.columns.length - 1; i >= 0; i--) {
                        var col = this.grid.template.columns[i];
                        if (col.filterValue !== "")
                            cols[col.field] = col.filterValue;
                    }
                    return cols;
                };
                /** ============ Sorting ============== */
                LocalGridData.prototype.sortChanged = function (column, event) {
                    // Determine new sort
                    var newSort = undefined;
                    // Figure out which way this field should be sorting
                    switch (this.sorting[column.field]) {
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
                    if (!event.ctrlKey) {
                        // single sort - press Control for multi-sort
                        this.sorting = {};
                        this.sortProcessingOrder = [];
                    }
                    this.sorting[column.field] = newSort;
                    // If the sort is present in the sort stack, slice it to the back of the stack, otherwise just add it
                    var pos = this.sortProcessingOrder.indexOf(column.field);
                    if (pos > -1)
                        this.sortProcessingOrder.splice(pos, 1);
                    if (newSort)
                        this.sortProcessingOrder.push(column.field);
                    // Apply the new sort
                    this.refresh();
                };
                LocalGridData.prototype.applySort = function (data) {
                    //Format the sort fields
                    var fields = [];
                    // Get the fields in the "sortingORder"
                    for (var i = 0; i < this.sortProcessingOrder.length; i++) {
                        var sort = this.sortProcessingOrder[i];
                        for (var prop in this.sorting) {
                            if (sort == prop && this.sorting[prop] !== "")
                                fields.push(this.sorting[prop] === "asc" ? (prop) : ("-" + prop));
                        }
                    }
                    ;
                    if (this.sortProcessingOrder.length > 0)
                        return this.allItems.sort(this.fieldSorter(fields));
                    else
                        return data;
                };
                LocalGridData.prototype.fieldSorter = function (fields) {
                    return function (a, b) {
                        return fields
                            .map(function (o) {
                            var dir = 1;
                            if (o[0] === '-') {
                                dir = -1;
                                o = o.substring(1);
                            }
                            if (a[o] > b[o])
                                return dir;
                            if (a[o] < b[o])
                                return -(dir);
                            return 0;
                        })
                            .reduce(function firstNonZeroValue(p, n) {
                            return p ? p : n;
                        }, 0);
                    };
                };
                /** ============ Pagination ============== */
                LocalGridData.prototype.applyPage = function (data) {
                    var start = (Number(this.page) - 1) * Number(this.pageSize);
                    data = data.slice(start, start + Number(this.pageSize));
                    return data;
                };
                /** Watch for changes to the data */
                LocalGridData.prototype.watchForChanges = function () {
                    var _this = this;
                    this.dontWatchForChanges();
                    if (!this.grid.unbinding) {
                        // We can update the pager automagically
                        this.subscription = this.grid.bindingEngine
                            .collectionObserver(this.cache)
                            .subscribe(function (splices) {
                            _this.refresh();
                        });
                    }
                };
                LocalGridData.prototype.dontWatchForChanges = function () {
                    if (this.subscription) {
                        this.subscription.dispose();
                        this.subscription = null;
                    }
                };
                LocalGridData.prototype.unbind = function () {
                    _super.prototype.unbind.call(this);
                    this.dontWatchForChanges();
                };
                return LocalGridData;
            })(GridDataSource);
            exports_1("LocalGridData", LocalGridData);
        }
    }
});
