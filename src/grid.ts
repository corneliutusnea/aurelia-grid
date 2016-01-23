import {bindable, inject, BindingEngine, customElement, processContent, TargetInstruction} from 'aurelia-framework';
import {ViewCompiler, ViewSlot, ViewResources, Container} from 'aurelia-framework';

import {GridColumn, GridColumnProperties} from 'grid-column';
import {GridRowAttributes} from 'grid-row';

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
	private viewCompiler: ViewCompiler;
	private viewResources: ViewResources;
	private container: Container;
	private targetInstruction: TargetInstruction;
	private bindingEngine: BindingEngine;
	
	private template: GridTemplate;
	
	// Properties
	@bindable autoLoad: boolean = true;
	@bindable loadingMessage: string = "Loading ...";
	@bindable showColumnHeaders: boolean = true;
	
	
	constructor(element, vc: ViewCompiler, vr: ViewResources, container: Container, targetInstruction: TargetInstruction, bindingEngine: BindingEngine) {
		this.element = element;
		this.viewCompiler = vc;
		this.viewResources = vr;
		this.container = container;
		this.bindingEngine = bindingEngine;

		this.template = <GridTemplate>((<any>targetInstruction).behaviorInstructions[0]);
	}

	
}






interface GridTemplate{
	columns: GridColumnProperties[];
	rowAttributes: GridRowAttributes;
}
function processUserTemplate(element: any): GridTemplate{
	var cols = [];
	
	var rowElement = element.querySelector("grid-row");
	var columnElements = Array.prototype.slice.call(rowElement.querySelectorAll("grid-col"));

	columnElements.forEach(c => {
		var colProperties = new GridColumnProperties();
		var attrs = Array.prototype.slice.call(c.attributes);;
		attrs.forEach(a => colProperties[a.name] = a.value);

		var col = new GridColumn(colProperties, c.innerHTML);

		cols.push(col);
	});

	// Pull any row attrs into a hash object
	var rowsAttributes = new GridRowAttributes();
	var attrs = Array.prototype.slice.call(rowElement.attributes);
	attrs.forEach(a => rowsAttributes[a.name] = a.value);

	return { columns: cols, rowAttributes: rowsAttributes };
}