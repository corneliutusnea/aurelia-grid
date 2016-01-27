import {bindable, inject, BindingEngine, customElement, processContent, TargetInstruction} from 'aurelia-framework';
import {ViewCompiler, ViewSlot, ViewResources, Container} from 'aurelia-framework';

import {GridColumn} from './grid-column';
import {GridRowAttributes} from './grid-row';
import {GridSelection} from './grid-selection';
import {GridBuilder} from './grid-builder';
import {GridIcons} from './grid-icons';
import * as D from './grid-data';

@customElement('grid')
@processContent(function(viewCompiler, viewResources, element, instruction) {
	// Do stuff
	var result = processUserTemplate(element);
	
	instruction.columns = result.columns;
	instruction.rowAttributes = result.rowAttributes;

	return true;
})
@inject(Element, ViewCompiler, ViewResources, Container, TargetInstruction, BindingEngine)
export class Grid{
	private element: any;
	private targetInstruction: TargetInstruction;
	viewCompiler: ViewCompiler;
	viewResources: ViewResources;
	bindingEngine: BindingEngine;
	container: Container;
	
	template: GridTemplate;
	
	// Properties
	// Loading
	
	// Columns
	@bindable columnsShowHeaders: boolean = true;
	@bindable columnsCanSort: boolean = true;
	@bindable columnsCanFilter: boolean = false;
	
	// Visuals
	@bindable gridHeight: number;
	@bindable icons: GridIcons;
	
	selection: GridSelection;
	@bindable selectedItem: any;
	
	builder: GridBuilder;
	
	aaa: string = 'bbbb';
	
	// Data Source
	@bindable source: D.IGridDataSource;
	@bindable sourceAutoLoad: boolean = true;
	@bindable sourceType: string;	// local, remote
	@bindable sourceRead: (event: D.IDataInfo) => Promise<any>;
	/** allow the client to pre-process the data to get it in the right shape in case the data is not in the expected shape */
	@bindable sourceTransform: (result: any) => D.IGridData;
	@bindable sourceReadError: (result: any) => void;
	@bindable sourceLoadingMessage: string = "Loading ...";
	
	@bindable sourceCanPage: boolean = true;
	@bindable noDataMessage: string;
	
	// CSV with page sizes
	@bindable sourcePageSizes: number[] = [10, 25, 50];
		
	constructor(element, vc: ViewCompiler, vr: ViewResources, container: Container, targetInstruction: TargetInstruction, bindingEngine: BindingEngine) {
		this.element = element;
		this.viewCompiler = vc;
		this.viewResources = vr;
		this.container = container;
		this.bindingEngine = bindingEngine;

		this.template = <GridTemplate>((<any>targetInstruction).behaviorInstructions[0]);

		this.selection = new GridSelection(this);
		this.builder = new GridBuilder(this, this.element);
	}

	unbinding: boolean = false;
	bind(bindingContext){
		this["$parent"] = bindingContext;
	
		// todo - make glyphicons and fa icons classes
		this.icons = new GridIcons();
		
		if(this.sourceType == "remote"){
			// todo
		} else{
			// local
			this.source = new D.LocalGridData(this);
		}
		
		this.builder.build();
	}
	
	unbind(){
		this.unbinding = true;
		this.builder.unbind();
		this.source.unbind();
	}
	
	attached(){
		this.gridHeightChanged();
		this.source.attached();
	}
	
	
	/* ==== Visual Handling ===== */
	gridHeightChanged() {
		if(this.gridHeight > 0) {
			this.gridContainer.setAttribute("style", "height:" + this.gridHeight + "px");
		} else {
			this.gridContainer.removeAttribute("style");
		}
	}
	
	refresh(){
		this.source.refresh();
	}
	
	/** Cached Properties */
	private _gridContainer: any;
	get gridContainer(): any{
		this._gridContainer = this._gridContainer || this.element.querySelector(".grid-content-container");
		return this._gridContainer;
	}
	private _gridHeaders: any;
	get gridHeaders(): any{
		if(!this._gridHeaders)
			this._gridHeaders = this.element.querySelectorAll("table>thead>tr:first-child>th");
		return this._gridHeaders;
	}
	private _gridFilters: any;
	get gridFilters(): any{
		if(!this._gridFilters)
			this._gridFilters = this.element.querySelectorAll("table>thead>tr:last-child>th");
		return this._gridFilters;
	}
}

export interface GridTemplate{
	columns: GridColumn[];
	rowAttributes: GridRowAttributes;
}
function processUserTemplate(element: any): GridTemplate{
	var cols = [];
	
	var rowElement = element.querySelector("grid-row");
	var columnElements = Array.prototype.slice.call(rowElement.querySelectorAll("grid-col"));

	var camelCaseName = (name:string):string => {
		return name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
	}; 

var columnTemplate = 
'<span class="grid-column-heading">${$column.heading}</span>' +
'<span if.bind="$column.sorting === \'desc\'" class="${$grid.icons.sortingDesc}"></span>' +
'<span if.bind="$column.sorting === \'asc\'" class="${$grid.icons.sortingAsc}"></span>';

	// <grid-col can-sort="true" heading="header"> ..
	// or <grid-col can-sort="true"><heading>header template</heading><template>cell template</template> 
	columnElements.forEach(c => {
		var col = new GridColumn();
		
		var attrs = Array.prototype.slice.call(c.attributes);		
		attrs.forEach(a => col[camelCaseName(a.name)] = a.value);

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
	var rowsAttributes = new GridRowAttributes();
	var attrs = Array.prototype.slice.call(rowElement.attributes);
	attrs.forEach(a => rowsAttributes[a.name] = a.value);

	return { columns: cols, rowAttributes: rowsAttributes };
}
