System.register(['aurelia-framework', 'grid-column', 'grid-row'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var aurelia_framework_1, aurelia_framework_2, grid_column_1, grid_row_1;
    var Grid;
    function processUserTemplate(element) {
        var cols = [];
        var rowElement = element.querySelector("grid-row");
        var columnElements = Array.prototype.slice.call(rowElement.querySelectorAll("grid-col"));
        columnElements.forEach(function (c) {
            var colProperties = new grid_column_1.GridColumnProperties();
            var attrs = Array.prototype.slice.call(c.attributes);
            ;
            attrs.forEach(function (a) { return colProperties[a.name] = a.value; });
            var col = new grid_column_1.GridColumn(colProperties, c.innerHTML);
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
            }],
        execute: function() {
            Grid = (function () {
                function Grid(element, vc, vr, container, targetInstruction, bindingEngine) {
                    // Properties
                    this.autoLoad = true;
                    this.loadingMessage = "Loading ...";
                    this.showColumnHeaders = true;
                    this.element = element;
                    this.viewCompiler = vc;
                    this.viewResources = vr;
                    this.container = container;
                    this.bindingEngine = bindingEngine;
                    this.template = (targetInstruction.behaviorInstructions[0]);
                }
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], Grid.prototype, "autoLoad", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', String)
                ], Grid.prototype, "loadingMessage", void 0);
                __decorate([
                    aurelia_framework_1.bindable, 
                    __metadata('design:type', Boolean)
                ], Grid.prototype, "showColumnHeaders", void 0);
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
