System.register(['aurelia-framework'], function(exports_1) {
    var aurelia_framework_1, aurelia_framework_2;
    var GridBuilder;
    return {
        setters:[
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
                aurelia_framework_2 = aurelia_framework_1_1;
            }],
        execute: function() {
            GridBuilder = (function () {
                function GridBuilder(grid, element) {
                    this.scrollBarWidth = 16;
                    this.grid = grid;
                    this.element = element;
                    this.template = this.grid.template;
                    this.viewCompiler = this.grid.viewCompiler;
                    this.viewResources = this.grid.viewResources;
                    this.bindingEngine = this.grid.bindingEngine;
                    this.container = this.grid.container;
                }
                GridBuilder.prototype.build = function () {
                    // Listen for window resize so we can re-flow the grid layout
                    this.resizeListener = window.addEventListener('resize', this.headersSyncColumnHeadersWithColumns.bind(this));
                    this.buildHeadingTemplate();
                    this.buildRowTemplate();
                    this.buildPagerTemplate();
                };
                GridBuilder.prototype.buildHeadingTemplate = function () {
                    var _this = this;
                    this.headersViewSlots = [];
                    var theadTr = this.element.querySelector("table.grid-header-table>thead>tr.grid-headings");
                    // Create the columns headers
                    this.template.columns.forEach(function (c) {
                        // each TH has it's own viewSlot so they have different bindings
                        var fragment = document.createDocumentFragment();
                        var th = document.createElement("th");
                        th.setAttribute("class", "grid-column ${$column.headerClass} ${($column.canSort && $grid.columnsCanSort) ? 'grid-column-sortable': 'grid-column-non-sortable'} ${ $column.class !== '' ? $column.class : '' }");
                        th.innerHTML = c.headingTemplate;
                        fragment.appendChild(th);
                        var view = _this.viewCompiler.compile(fragment, _this.viewResources).create(_this.container);
                        var bindingContext = {
                            '$grid': _this.grid,
                            '$column': c,
                            '$p': _this.grid.bindingContext
                        };
                        var context = aurelia_framework_1.createOverrideContext(bindingContext, _this.grid.bindingContext);
                        view.bind(_this.grid, context);
                        var columnSlot = new aurelia_framework_2.ViewSlot(theadTr, true);
                        columnSlot.add(view);
                        columnSlot.attached();
                        c.slot = columnSlot;
                        c.view = view;
                        _this.headersViewSlots.push(columnSlot);
                    });
                };
                GridBuilder.prototype.buildRowTemplate = function () {
                    // The table body element will host the rows
                    var tbody = this.element.querySelector("table>tbody");
                    this.rowsViewSlot = new aurelia_framework_2.ViewSlot(tbody, true);
                    // Get the row template too and add a repeater/class
                    var row = tbody.querySelector("tr");
                    this.rowTemplate = document.createDocumentFragment();
                    this.rowTemplate.appendChild(row);
                    // builds <template><tr repeat.for="$item of data">...</template>
                    row.setAttribute("repeat.for", "$item of source.items");
                    row.setAttribute("class", "${ $item === $grid.selectedItem ? 'info' : '' }");
                    // TODO: Do we allow the user to customise the row template or just
                    // provide a callback?
                    // Copy any user specified row attributes to the row template
                    for (var prop in this.template.rowAttributes) {
                        if (this.template.rowAttributes.hasOwnProperty(prop)) {
                            row.setAttribute(prop, this.template.rowAttributes[prop]);
                        }
                    }
                    // Create a fragment we will manipulate the DOM in
                    var rowTemplate = this.rowTemplate.cloneNode(true);
                    var row = rowTemplate.querySelector("tr");
                    // Create the columns
                    this.template.columns.forEach(function (col) {
                        var td = document.createElement("td");
                        td.innerHTML = col["template"];
                        td.className = col["class"];
                        row.appendChild(td);
                    });
                    // Now compile the row template
                    var view = this.viewCompiler.compile(rowTemplate, this.viewResources).create(this.container);
                    var bindingContext = {
                        '$grid': this.grid,
                        '$p': this.grid.bindingContext
                    };
                    var context = aurelia_framework_1.createOverrideContext(bindingContext, this.grid.bindingContext);
                    view.bind(this.grid, context);
                    this.rowsViewSlot.add(view);
                    this.rowsViewSlot.attached();
                };
                GridBuilder.prototype.buildPagerTemplate = function () {
                    // build the custom template for the pager (if it exists)
                    // otherwise the default template will be shown
                    var thost = this.element.querySelector("div.grid-footer-custom-container");
                    if (!this.grid.pager.template) {
                        // todo - remove the thost somehow
                        return;
                    }
                    this.pagerViewSlot = new aurelia_framework_2.ViewSlot(thost, true);
                    var template = document.createDocumentFragment();
                    var templateValue = document.createElement('div');
                    template.appendChild(templateValue);
                    templateValue.innerHTML = this.grid.pager.template;
                    var view = this.viewCompiler.compile(template, this.viewResources).create(this.container);
                    var bindingContext = {
                        // I'm having problem if I try to use $parent. The template never seems to see that
                        '$parent': this.grid,
                        '$grid': this.grid,
                        '$pager': this.grid.pager,
                        '$source': this.grid.source
                    };
                    var context = aurelia_framework_1.createOverrideContext(bindingContext, this.grid.bindingContext);
                    view.bind(this.grid, context);
                    this.pagerViewSlot.add(view);
                    this.pagerViewSlot.attached();
                };
                GridBuilder.prototype.unbind = function () {
                    window.removeEventListener('resize', this.resizeListener);
                };
                GridBuilder.prototype.headersSyncColumnHeadersWithColumns = function () {
                    // Get the first row from the data if there is one...
                    var cells = this.element.querySelectorAll("table>tbody>tr:first-child>td");
                    for (var i = this.grid.gridHeaders.length - 1; i >= 0; i--) {
                        var header = this.grid.gridHeaders[i];
                        var filter = this.grid.gridFilters[i];
                        var cell = cells[i];
                        if (cell && header && filter) {
                            var overflow = this.isBodyOverflowing();
                            var tgtWidth = cell.offsetWidth + (i == this.grid.gridHeaders.length - 1 && overflow ? this.scrollBarWidth : 0);
                            // Make the header the same width as the cell...
                            header.setAttribute("style", "width: " + tgtWidth + "px");
                            filter.setAttribute("style", "width: " + tgtWidth + "px");
                        }
                    }
                    ;
                };
                GridBuilder.prototype.isBodyOverflowing = function () {
                    var container = this.grid.gridContainer;
                    return container.offsetHeight < container.scrollHeight || container.offsetWidth < container.scrollWidth;
                };
                return GridBuilder;
            })();
            exports_1("GridBuilder", GridBuilder);
        }
    }
});
