System.register(['./grid-source'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var grid_source_1;
    var RemoteGridData;
    return {
        setters:[
            function (grid_source_1_1) {
                grid_source_1 = grid_source_1_1;
            }],
        execute: function() {
            /** Remote Source of Grid Data - Server side Paging and Sorting */
            RemoteGridData = (function (_super) {
                __extends(RemoteGridData, _super);
                function RemoteGridData() {
                    _super.apply(this, arguments);
                }
                return RemoteGridData;
            }(grid_source_1.GridDataSource));
            exports_1("RemoteGridData", RemoteGridData);
        }
    }
});
