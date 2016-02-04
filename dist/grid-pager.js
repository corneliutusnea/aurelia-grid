System.register(['aurelia-framework'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var aurelia_framework_1;
    var GridPager;
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            }],
        execute: function() {
            GridPager = (function () {
                function GridPager() {
                    this.enabled = true;
                    /** number of pages to show in the pager */
                    this.numPagesToShow = 5;
                    this.showFirstLast = true;
                    this.showJump = true;
                    this.showPagingSummary = true;
                    // CSV with page sizes
                    this.pageSizes = [10, 25, 50];
                    this.nextDisabled = false;
                    this.prevDisabled = false;
                    this.firstVisibleItem = 0;
                    this.lastVisibleItem = 0;
                    this.autoHide = true;
                    this.pages = [];
                }
                GridPager.prototype.refresh = function () {
                    if (!this.grid.source)
                        return; // no source?
                    // something changed in the data - recalculate
                    // Cap the number of pages to render if the count is less than number to show at once
                    var numToRender = this.grid.source.pageCount < this.numPagesToShow ? this.grid.source.pageCount : this.numPagesToShow;
                    // The current page should try to appear in the middle, so get the median 
                    // of the number of pages to show at once - this will be our adjustment factor
                    var indicatorPosition = Math.ceil(numToRender / 2);
                    // Subtract the pos from the current page to get the first page no
                    var firstPageNumber = this.grid.source.page - indicatorPosition + 1;
                    // If the first page is less than 1, make it 1
                    if (firstPageNumber < 1)
                        firstPageNumber = 1;
                    // Add the number of pages to render
                    // remember to subtract 1 as this represents the first page number
                    var lastPageNumber = firstPageNumber + numToRender - 1;
                    // If the last page is greater than the page count
                    // add the difference to the first/last page
                    if (lastPageNumber > this.grid.source.pageCount) {
                        var dif = this.grid.source.pageCount - lastPageNumber;
                        firstPageNumber += dif;
                        lastPageNumber += dif;
                    }
                    var pages = [];
                    for (var i = firstPageNumber; i <= lastPageNumber; i++) {
                        pages.push(i);
                    }
                    ;
                    this.pages = pages;
                    this.firstVisibleItem = (this.grid.source.page - 1) * Number(this.grid.source.pageSize) + 1;
                    this.lastVisibleItem = Math.min((this.grid.source.page) * Number(this.grid.source.pageSize), this.grid.source.count);
                    this.updateButtons();
                };
                GridPager.prototype.updateButtons = function () {
                    this.nextDisabled = this.grid.source.page === this.grid.source.pageCount;
                    this.prevDisabled = this.grid.source.page === 1;
                };
                // pageSizeChanged(newValue: number, oldValue: number) {
                // 	debugger;
                // 	if (newValue == oldValue)
                // 		return;
                // 	this.grid.source.pageSize = newValue;
                // 	this.grid.source.refresh();
                // }
                GridPager.prototype.changePage = function (page) {
                    var oldPage = this.grid.source.page;
                    this.grid.source.page = this.validate(page);
                    if (oldPage !== this.grid.source.page) {
                        this.grid.source.refresh();
                    }
                };
                GridPager.prototype.next = function () {
                    this.changePage(this.grid.source.page + 1);
                };
                GridPager.prototype.nextJump = function () {
                    this.changePage(this.grid.source.page + this.numPagesToShow);
                };
                GridPager.prototype.prev = function () {
                    this.changePage(this.grid.source.page - 1);
                };
                GridPager.prototype.prevJump = function () {
                    this.changePage(this.grid.source.page - this.numPagesToShow);
                };
                GridPager.prototype.first = function () {
                    this.changePage(1);
                };
                GridPager.prototype.last = function () {
                    this.changePage(this.grid.source.pageCount);
                };
                GridPager.prototype.validate = function (page) {
                    if (page < 1)
                        return 1;
                    if (page > this.grid.source.pageCount)
                        return this.grid.source.pageCount;
                    return page;
                };
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Number)
                ], GridPager.prototype, "numPagesToShow", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], GridPager.prototype, "showFirstLast", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], GridPager.prototype, "showJump", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], GridPager.prototype, "showPagingSummary", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Array)
                ], GridPager.prototype, "pageSizes", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], GridPager.prototype, "nextDisabled", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], GridPager.prototype, "prevDisabled", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Number)
                ], GridPager.prototype, "firstVisibleItem", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Number)
                ], GridPager.prototype, "lastVisibleItem", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], GridPager.prototype, "autoHide", void 0);
                return GridPager;
            })();
            exports_1("GridPager", GridPager);
        }
    }
});
