System.register(['./grid-source'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var grid_source_1;
    var DelegateGridData;
    return {
        setters:[
            function (grid_source_1_1) {
                grid_source_1 = grid_source_1_1;
            }],
        execute: function() {
            /** Remote Source of Grid Data via a function */
            DelegateGridData = (function (_super) {
                __extends(DelegateGridData, _super);
                function DelegateGridData(grid) {
                    _super.call(this, grid);
                    this.dataRead = grid.sourceRead;
                    if (!this.dataRead) {
                        throw new Error("'data-read.call' is not defined on the grid.");
                    }
                    this.supportsPagination = this.grid.sourceSupportsPagination;
                    this.supportsSorting = this.grid.sourceSupportsSorting;
                    this.supportsMultiColumnSorting = this.grid.sourceSupportsMultiColumnSorting;
                }
                DelegateGridData.prototype.refresh = function () {
                    var _this = this;
                    this.loading = true;
                    var sort = this.sorting.map(function (s) {
                        return { field: s.field, sorting: s.sorting };
                    });
                    var d = this.dataRead({
                        page: this.page,
                        pageSize: this.pageSize,
                        sort: sort
                    });
                    if (d.then) {
                        d.then(function (result) {
                            _this.handleResult(result);
                            _this.loading = false;
                        }).catch(function (error) {
                            if (_this.grid.sourceReadError)
                                _this.grid.sourceReadError(error);
                            _this.loading = false;
                        });
                    }
                    else {
                        if (Array.isArray(d)) {
                            this.handleResult(d, true);
                            this.loading = false;
                        }
                        else {
                            this.handleResult(d, false);
                            this.loading = false;
                        }
                    }
                    ;
                };
                DelegateGridData.prototype.handleResult = function (result, isArray) {
                    if (isArray === void 0) { isArray = false; }
                    var r;
                    if (this.grid.sourceTransform)
                        r = this.grid.sourceTransform(result);
                    else {
                        if (isArray) {
                            r = { data: result, count: result.length };
                        }
                        else {
                            r = result;
                        }
                    }
                    if (r) {
                        this.count = r.count;
                        this.items = r.data;
                    }
                    this.onData();
                };
                return DelegateGridData;
            })(grid_source_1.GridDataSource);
            exports_1("DelegateGridData", DelegateGridData);
        }
    }
});
