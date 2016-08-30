import {noView, children, bindable, child, inject, BindingEngine, customElement, processContent, TargetInstruction} from 'aurelia-framework';
import {ViewCompiler, ViewSlot, ViewResources, Container} from 'aurelia-framework';

import './aurelia-grid.css';

import {GridColumn} from './grid-column';
import {GridRowAttributes} from './grid-row';
import {GridSelection} from './grid-selection';
import {GridBuilder} from './grid-builder';
import {GridIcons} from './grid-icons';
import {GridPager} from './grid-pager';

import {GridTemplate, GridParser} from './grid-parser';
import * as D from './grid-source';
import {LocalGridData} from './grid-local-source';
import {DelegateGridData} from './grid-delegate-source';

@customElement('grid')
@processContent(function(viewCompiler, viewResources, element, instruction) {
	var result = processUserTemplate(element);
	
	instruction.columns = result.columns;
	instruction.rowAttributes = result.rowAttributes;
	instruction.pager = result.pager;

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
	
	// Data Source
	@bindable source: D.IGridDataSource;
	@bindable sourceAutoLoad: boolean = true;
	@bindable sourceType: string;	// local, remote
	@bindable sourceRead: (event: D.IDataInfo) => Promise<any>;
	/** allow the client to pre-process the data to get it in the right shape in case the data is not in the expected shape */
	@bindable sourceTransform: (result: any) => D.IGridData;
	@bindable sourceReadError: (result: any) => void;
	@bindable sourceLoadingMessage: string = "Loading ...";
	
	// Potential overrides (might not apply!!!) as some sources have their own definition of supports
	// these only really work for the delegate and remote sources
	@bindable sourceSupportsPagination: boolean = false;
	@bindable sourceSupportsSorting: boolean = false;
	@bindable sourceSupportsMultiColumnSorting: boolean = false;
	
	pager: GridPager;
	
	constructor(element: Element, vc: ViewCompiler, vr: ViewResources, container: Container, targetInstruction: TargetInstruction, bindingEngine: BindingEngine) {
		this.element = element;
		this.viewCompiler = vc;
		this.viewResources = vr;
		this.container = container;
		this.bindingEngine = bindingEngine;

		this.template = <GridTemplate>((<any>targetInstruction).behaviorInstructions[0]);
		this.pager = this.template.pager;
		this.pager.grid = this;
		
		this.selection = new GridSelection(this);
		this.builder = new GridBuilder(this, this.element);
	}

	unbinding: boolean = false;
	bind(bindingContext){
		this["$parent"] = bindingContext;
	
		// todo - make glyphicons and fa icons classes
		this.icons = new GridIcons();
		
		switch(this.sourceType)
		{
			case "remote":{
				// todo:
				throw new Error("Remote data source not supported");
			}
			case "delegate":{
				this.source = new DelegateGridData(this);
				break;
			}
			default:{
				// local
				this.source = new LocalGridData(this);
				break;
			}
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
		this.pager.refresh();
		
		// fix pageSize
		this.pageSize = this.pager.pageSizes[0];
		this.source.pageSize = this.pageSize;
		
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
	
	@bindable pageSize: number = 25;
	pageSizeChanged(newValue: number, oldValue: number){
		if(this.source.pageSize == this.pageSize)
			return;
		this.source.pageSize = newValue;
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


function processUserTemplate(element: any): GridTemplate{
	var parser = new GridParser();
	return parser.parse(element);	
}
