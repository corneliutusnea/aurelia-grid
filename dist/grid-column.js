System.register([], function(exports_1) {
    var GridColumnProperties, GridColumn;
    return {
        setters:[],
        execute: function() {
            /** All Attributes on <grid-col  */
            GridColumnProperties = (function () {
                function GridColumnProperties() {
                }
                return GridColumnProperties;
            })();
            exports_1("GridColumnProperties", GridColumnProperties);
            GridColumn = (function () {
                /** config: GridColumnConfig, template: innerHtml template  */
                function GridColumn(config, template) {
                    this.config = config;
                    this.template = template;
                    // we can accept the field to be null if the column has no sorting enabled
                    if (this.config.cansort) {
                        if (!this.config.field) {
                            throw new Error("field is required if the column is sortable.");
                        }
                    }
                }
                return GridColumn;
            })();
            exports_1("GridColumn", GridColumn);
        }
    }
});
