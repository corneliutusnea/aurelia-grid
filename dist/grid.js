System.register(['aurelia-framework', './grid-selection', './grid-builder', './grid-icons', './grid-parser', './grid-source', './grid-local-source', './grid-delegate-source'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var aurelia_framework_1, aurelia_framework_2, grid_selection_1, grid_builder_1, grid_icons_1, grid_parser_1, D, grid_local_source_1, grid_delegate_source_1;
    var Grid;
    function processUserTemplate(element) {
        var parser = new grid_parser_1.GridParser();
        return parser.parse(element);
    }
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
                aurelia_framework_2 = aurelia_framework_1_1;
            },
            function (grid_selection_1_1) {
                grid_selection_1 = grid_selection_1_1;
            },
            function (grid_builder_1_1) {
                grid_builder_1 = grid_builder_1_1;
            },
            function (grid_icons_1_1) {
                grid_icons_1 = grid_icons_1_1;
            },
            function (grid_parser_1_1) {
                grid_parser_1 = grid_parser_1_1;
            },
            function (D_1) {
                D = D_1;
            },
            function (grid_local_source_1_1) {
                grid_local_source_1 = grid_local_source_1_1;
            },
            function (grid_delegate_source_1_1) {
                grid_delegate_source_1 = grid_delegate_source_1_1;
            }],
        execute: function() {
            Grid = (function () {
                function Grid(element, vc, vr, container, targetInstruction, bindingEngine) {
                    // Columns
                    this.columnsShowHeaders = true;
                    this.columnsCanSort = true;
                    this.columnsCanFilter = false;
                    this.sourceAutoLoad = true;
                    this.sourceLoadingMessage = "Loading ...";
                    // Potential overrides (might not apply!!!) as some sources have their own definition of supports
                    // these only really work for the delegate and remote sources
                    this.sourceSupportsPagination = false;
                    this.sourceSupportsSorting = false;
                    this.sourceSupportsMultiColumnSorting = false;
                    this.unbinding = false;
                    this.pageSize = 25;
                    this.element = element;
                    this.viewCompiler = vc;
                    this.viewResources = vr;
                    this.container = container;
                    this.bindingEngine = bindingEngine;
                    this.template = (targetInstruction.behaviorInstructions[0]);
                    this.pager = this.template.pager;
                    this.pager.grid = this;
                    this.selection = new grid_selection_1.GridSelection(this);
                    this.builder = new grid_builder_1.GridBuilder(this, this.element);
                }
                Grid.prototype.bind = function (bindingContext) {
                    this["$parent"] = bindingContext;
                    // todo - make glyphicons and fa icons classes
                    this.icons = new grid_icons_1.GridIcons();
                    switch (this.sourceType) {
                        case "remote": {
                            // todo:
                            throw new Error("Remote data source not supported");
                        }
                        case "delegate": {
                            this.source = new grid_delegate_source_1.DelegateGridData(this);
                            break;
                        }
                        default: {
                            // local
                            this.source = new grid_local_source_1.LocalGridData(this);
                            break;
                        }
                    }
                    this.builder.build();
                };
                Grid.prototype.unbind = function () {
                    this.unbinding = true;
                    this.builder.unbind();
                    this.source.unbind();
                };
                Grid.prototype.attached = function () {
                    this.gridHeightChanged();
                    this.pager.refresh();
                    // fix pageSize
                    this.pageSize = this.pager.pageSizes[0];
                    this.source.pageSize = this.pageSize;
                    this.source.attached();
                };
                /* ==== Visual Handling ===== */
                Grid.prototype.gridHeightChanged = function () {
                    if (this.gridHeight > 0) {
                        this.gridContainer.setAttribute("style", "height:" + this.gridHeight + "px");
                    }
                    else {
                        this.gridContainer.removeAttribute("style");
                    }
                };
                Grid.prototype.refresh = function () {
                    this.source.refresh();
                };
                Grid.prototype.pageSizeChanged = function (newValue, oldValue) {
                    if (this.source.pageSize == this.pageSize)
                        return;
                    this.source.pageSize = newValue;
                    this.source.refresh();
                };
                Object.defineProperty(Grid.prototype, "gridContainer", {
                    get: function () {
                        this._gridContainer = this._gridContainer || this.element.querySelector(".grid-content-container");
                        return this._gridContainer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Grid.prototype, "gridHeaders", {
                    get: function () {
                        if (!this._gridHeaders)
                            this._gridHeaders = this.element.querySelectorAll("table>thead>tr:first-child>th");
                        return this._gridHeaders;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Grid.prototype, "gridFilters", {
                    get: function () {
                        if (!this._gridFilters)
                            this._gridFilters = this.element.querySelectorAll("table>thead>tr:last-child>th");
                        return this._gridFilters;
                    },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], Grid.prototype, "columnsShowHeaders", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], Grid.prototype, "columnsCanSort", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], Grid.prototype, "columnsCanFilter", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Number)
                ], Grid.prototype, "gridHeight", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', grid_icons_1.GridIcons)
                ], Grid.prototype, "icons", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Object)
                ], Grid.prototype, "selectedItem", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Object)
                ], Grid.prototype, "source", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], Grid.prototype, "sourceAutoLoad", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', String)
                ], Grid.prototype, "sourceType", void 0);
                __decorate([
                    // local, remote
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Function)
                ], Grid.prototype, "sourceRead", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Function)
                ], Grid.prototype, "sourceTransform", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Function)
                ], Grid.prototype, "sourceReadError", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', String)
                ], Grid.prototype, "sourceLoadingMessage", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], Grid.prototype, "sourceSupportsPagination", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], Grid.prototype, "sourceSupportsSorting", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], Grid.prototype, "sourceSupportsMultiColumnSorting", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Number)
                ], Grid.prototype, "pageSize", void 0);
                Grid = __decorate([
                    aurelia_framework_1.customElement('grid'),
                    aurelia_framework_1.processContent(function (viewCompiler, viewResources, element, instruction) {
                        var result = processUserTemplate(element);
                        instruction.columns = result.columns;
                        instruction.rowAttributes = result.rowAttributes;
                        instruction.pager = result.pager;
                        return true;
                    }),
                    aurelia_framework_1.inject(Element, aurelia_framework_2.ViewCompiler, aurelia_framework_2.ViewResources, aurelia_framework_2.Container, aurelia_framework_1.TargetInstruction, aurelia_framework_1.BindingEngine), 
                    __metadata('design:paramtypes', [Element, aurelia_framework_2.ViewCompiler, aurelia_framework_2.ViewResources, aurelia_framework_2.Container, aurelia_framework_1.TargetInstruction, aurelia_framework_1.BindingEngine])
                ], Grid);
                return Grid;
            })();
            exports_1("Grid", Grid);
        }
    }
});
