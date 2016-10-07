System.register(['./grid-column', './grid-row', './grid-pager', 'aurelia-framework'], function(exports_1) {
    var grid_column_1, grid_row_1, grid_pager_1, aurelia_framework_1;
    var GridParser;
    return {
        setters:[
            function (grid_column_1_1) {
                grid_column_1 = grid_column_1_1;
            },
            function (grid_row_1_1) {
                grid_row_1 = grid_row_1_1;
            },
            function (grid_pager_1_1) {
                grid_pager_1 = grid_pager_1_1;
            },
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            }],
        execute: function() {
            /** Helper to do the parsing of the grid content */
            GridParser = (function () {
                function GridParser() {
                }
                GridParser.prototype.parse = function (element) {
                    var result = {
                        columns: this.parseGridCols(element),
                        rowAttributes: this.parseGridRow(element),
                        pager: this.parseGridPager(element)
                    };
                    return result;
                };
                GridParser.prototype.parseGridCols = function (element) {
                    var _this = this;
                    var rowElement = element.querySelector("grid-row");
                    if (!rowElement) {
                        aurelia_framework_1.LogManager.getLogger("aurelia-grid").warn("Grid has no <grid-row> defined");
                        return [];
                    }
                    var columnElements = Array.prototype.slice.call(rowElement.querySelectorAll("grid-col"));
                    var cols = [];
                    var columnTemplate = '<div class="grid-column-header" click.trigger="$grid.source.sortChanged($column, $event)"><span class="grid-column-heading">${$column.heading}</span>' +
                        '<span if.bind="$column.sorting === \'desc\'" class="${$grid.icons.sortingDesc}"></span>' +
                        '<span if.bind="$column.sorting === \'asc\'" class="${$grid.icons.sortingAsc}"></span></div>';
                    // <grid-col can-sort="true" heading="header"> ..
                    // or <grid-col can-sort="true"><heading>header template</heading><template>cell template</template> 
                    columnElements.forEach(function (c) {
                        var col = new grid_column_1.GridColumn();
                        var attrs = Array.prototype.slice.call(c.attributes);
                        attrs.forEach(function (a) { return _this.tryAssign(col, _this.camelCaseName(a.name), a.value); });
                        // check for inner <heading> of template
                        var headingTemplate = c.querySelector("heading");
                        col.headingTemplate = (headingTemplate && headingTemplate.innerHTML) ? headingTemplate.innerHTML : columnTemplate;
                        // check for inner content of <template> or use full content as template
                        var cellTemplate = c.querySelector("template");
                        col.template = (cellTemplate && cellTemplate.innerHTML) ? cellTemplate.innerHTML : c.innerHTML;
                        var footerTemplate = c.querySelector("footer");
                        col.footerTemplate = (footerTemplate && footerTemplate.innerHTML) ? footerTemplate.innerHTML : null;
                        col.init();
                        cols.push(col);
                    });
                    return cols;
                };
                GridParser.prototype.parseGridRow = function (element) {
                    // Pull any row attrs into a hash object
                    var rowsAttributes = new grid_row_1.GridRowAttributes();
                    var rowElement = element.querySelector("grid-row");
                    if (!rowElement) {
                        aurelia_framework_1.LogManager.getLogger("aurelia-grid").warn("Grid has no <grid-row> defined");
                        return rowsAttributes;
                    }
                    var attrs = Array.prototype.slice.call(rowElement.attributes);
                    attrs.forEach(function (a) { return rowsAttributes[a.name] = a.value; });
                    return rowsAttributes;
                };
                GridParser.prototype.parseGridPager = function (element) {
                    var _this = this;
                    var pagerElement = element.querySelector("grid-pager");
                    var pager = new grid_pager_1.GridPager();
                    if (!pagerElement) {
                        return pager;
                    }
                    // fill in all properties
                    var attrs = Array.prototype.slice.call(pagerElement.attributes);
                    attrs.forEach(function (a) {
                        _this.tryAssign(pager, _this.camelCaseName(a.name), a.value);
                    });
                    var template = pagerElement.querySelector("template");
                    pager.template = (template && template.innerHTML) ? template.innerHTML : null;
                    return pager;
                };
                GridParser.prototype.camelCaseName = function (name) {
                    return name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
                };
                ;
                GridParser.prototype.tryAssign = function (target, name, value) {
                    var existing = target[name];
                    switch (typeof existing) {
                        case 'boolean':
                            target[name] = (value == 'true');
                            break;
                        case 'number':
                            target[name] = parseInt(value);
                            break;
                        default:
                            target[name] = value;
                            break;
                    }
                };
                return GridParser;
            })();
            exports_1("GridParser", GridParser);
        }
    }
});
