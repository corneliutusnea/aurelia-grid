System.register(['aurelia-framework', './grid-column', './grid-row', './grid-selection', './grid-builder', './grid-icons', './grid-data'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var aurelia_framework_1, aurelia_framework_2, grid_column_1, grid_row_1, grid_selection_1, grid_builder_1, grid_icons_1, D;
    var Grid;
    function processUserTemplate(element) {
        var cols = [];
        var rowElement = element.querySelector("grid-row");
        var columnElements = Array.prototype.slice.call(rowElement.querySelectorAll("grid-col"));
        var camelCaseName = function (name) {
            return name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        };
        var columnTemplate = '<span class="grid-column-heading">${$column.heading}</span>' +
            '<span if.bind="$column.sorting === \'desc\'" class="${$grid.icons.sortingDesc}"></span>' +
            '<span if.bind="$column.sorting === \'asc\'" class="${$grid.icons.sortingAsc}"></span>';
        // <grid-col can-sort="true" heading="header"> ..
        // or <grid-col can-sort="true"><heading>header template</heading><template>cell template</template> 
        columnElements.forEach(function (c) {
            var col = new grid_column_1.GridColumn();
            var attrs = Array.prototype.slice.call(c.attributes);
            attrs.forEach(function (a) { return col[camelCaseName(a.name)] = a.value; });
            // check for inner <heading> of template
            var headingTemplate = c.querySelector("heading");
            col.headingTemplate = (headingTemplate && headingTemplate.innerHTML) ? headingTemplate.innerHTML : columnTemplate;
            // check for inner content of <template> or use full content as template
            var cellTemplate = c.querySelector("template");
            col.template = (cellTemplate && cellTemplate.innerHTML) ? cellTemplate.innerHTML : c.innerHTML;
            col.init();
            cols.push(col);
        });
        // Pull any row attrs into a hash object
        var rowsAttributes = new grid_row_1.GridRowAttributes();
        var attrs = Array.prototype.slice.call(rowElement.attributes);
        attrs.forEach(function (a) { return rowsAttributes[a.name] = a.value; });
        return { columns: cols, rowAttributes: rowsAttributes };
    }
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
                aurelia_framework_2 = aurelia_framework_1_1;
            },
            function (grid_column_1_1) {
                grid_column_1 = grid_column_1_1;
            },
            function (grid_row_1_1) {
                grid_row_1 = grid_row_1_1;
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
            function (D_1) {
                D = D_1;
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
                    this.sourceCanPage = true;
                    // CSV with page sizes
                    this.sourcePageSizes = [10, 25, 50];
                    this.unbinding = false;
                    this.element = element;
                    this.viewCompiler = vc;
                    this.viewResources = vr;
                    this.container = container;
                    this.bindingEngine = bindingEngine;
                    this.template = (targetInstruction.behaviorInstructions[0]);
                    this.selection = new grid_selection_1.GridSelection(this);
                    this.builder = new grid_builder_1.GridBuilder(this, this.element);
                }
                Grid.prototype.bind = function (bindingContext) {
                    this["$parent"] = bindingContext;
                    // todo - make glyphicons and fa icons classes
                    this.icons = new grid_icons_1.GridIcons();
                    if (this.sourceType == "remote") {
                    }
                    else {
                        // local
                        this.source = new D.LocalGridData(this);
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
                ], Grid.prototype, "sourceCanPage", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', String)
                ], Grid.prototype, "noDataMessage", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Array)
                ], Grid.prototype, "sourcePageSizes", void 0);
                Grid = __decorate([
                    aurelia_framework_1.customElement('grid'),
                    aurelia_framework_1.processContent(function (viewCompiler, viewResources, element, instruction) {
                        // Do stuff
                        var result = processUserTemplate(element);
                        instruction.columns = result.columns;
                        instruction.rowAttributes = result.rowAttributes;
                        return true;
                    }),
                    aurelia_framework_1.inject(Element, aurelia_framework_2.ViewCompiler, aurelia_framework_2.ViewResources, aurelia_framework_2.Container, aurelia_framework_1.TargetInstruction, aurelia_framework_1.BindingEngine), 
                    __metadata('design:paramtypes', [Object, aurelia_framework_2.ViewCompiler, aurelia_framework_2.ViewResources, aurelia_framework_2.Container, aurelia_framework_1.TargetInstruction, aurelia_framework_1.BindingEngine])
                ], Grid);
                return Grid;
            })();
            exports_1("Grid", Grid);
        }
    }
});
