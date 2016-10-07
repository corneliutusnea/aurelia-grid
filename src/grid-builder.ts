import {bindable, inject, BindingEngine, customElement, processContent, TargetInstruction, createOverrideContext} from 'aurelia-framework';
import {ViewCompiler, ViewSlot, ViewResources, Container} from 'aurelia-framework';

/** Builds the Grid based on the existing template - maybe we can replace this in the future */
/** Currently this builds based on Bootstrap grid template */
import {Grid} from './grid';
import {GridTemplate} from './grid-parser';

export class GridBuilder {
	private grid: Grid;
	private template: GridTemplate;
	private viewCompiler: ViewCompiler;
	private viewResources: ViewResources;
	private bindingEngine: BindingEngine;
	private container: Container;

	private element: any;

	private rowsViewSlot: ViewSlot;
	private rowTemplate: any;

	private headersViewSlots: ViewSlot[];

	private pagerViewSlot: ViewSlot;

	private scrollBarWidth: number = 16;

	constructor(grid: Grid, element: any) {
		this.grid = grid;
		this.element = element;
		this.template = this.grid.template;

		this.viewCompiler = this.grid.viewCompiler;
		this.viewResources = this.grid.viewResources;
		this.bindingEngine = this.grid.bindingEngine;
		this.container = this.grid.container;
	}

	build() {
		// Listen for window resize so we can re-flow the grid layout
		this.resizeListener = window.addEventListener('resize', this.headersSyncColumnHeadersWithColumns.bind(this));

		this.buildHeadingTemplate();
		this.buildRowTemplate();
		this.buildPagerTemplate();
	}

	private buildHeadingTemplate(){
		this.headersViewSlots = [];

		var theadTr = this.element.querySelector("table.grid-header-table>thead>tr.grid-headings");

		// Create the columns headers
		this.template.columns.forEach(c => {
			// each TH has it's own viewSlot so they have different bindings
			var fragment = document.createDocumentFragment();

			var th = document.createElement("th");
			th.setAttribute("class", "grid-column ${$column.headerClass} ${($column.canSort && $grid.columnsCanSort) ? 'grid-column-sortable': 'grid-column-non-sortable'} ${ $column.class !== '' ? $column.class : '' }");
			
			th.innerHTML = c.headingTemplate;

			fragment.appendChild(th);

			var view = this.viewCompiler.compile(fragment, this.viewResources).create(this.container);
			let bindingContext = {
				'$grid' : this.grid,
				'$column' : c,
				'$p': this.grid.bindingContext
			}

			var context = createOverrideContext(bindingContext, this.grid.bindingContext);
			view.bind(this.grid, context);

			var columnSlot = new ViewSlot(theadTr, true);
			columnSlot.add(view);
			columnSlot.attached();

			c.slot = columnSlot;
			c.view = view;

			this.headersViewSlots.push(columnSlot);
		});
	}

	private buildRowTemplate() {
		// The table body element will host the rows
		var tbody = this.element.querySelector("table>tbody");
		this.rowsViewSlot = new ViewSlot(tbody, true);

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
		this.template.columns.forEach(col => {
			var td = document.createElement("td");

			td.innerHTML = col["template"];
			td.className = col["class"];
			
			row.appendChild(td);
		});

		// Now compile the row template
		var view = this.viewCompiler.compile(rowTemplate, this.viewResources).create(this.container);

		let bindingContext = { 
			'$grid': this.grid,
			'$p': this.grid.bindingContext
		};

		var context = createOverrideContext(bindingContext, this.grid.bindingContext);
		view.bind(this.grid, context);

		this.rowsViewSlot.add(view);
		this.rowsViewSlot.attached();
	}

	private buildPagerTemplate(){
		// build the custom template for the pager (if it exists)
		// otherwise the default template will be shown
		var thost = this.element.querySelector("div.grid-footer-custom-container");
		if(!this.grid.pager.template)
		{
			// todo - remove the thost somehow
			return;
		}

		this.pagerViewSlot = new ViewSlot(thost, true);
		var template = document.createDocumentFragment();
		var templateValue = document.createElement('div');
		template.appendChild(templateValue);
		templateValue.innerHTML = this.grid.pager.template;

		var view = this.viewCompiler.compile(template, this.viewResources).create(this.container);
		let bindingContext = {
			// I'm having problem if I try to use $parent. The template never seems to see that
			'$parent': this.grid,
			'$grid' : this.grid,
			'$pager' : this.grid.pager,
			'$source': this.grid.source
		};

		var context = createOverrideContext(bindingContext, this.grid.bindingContext);
		view.bind(this.grid, context);

		this.pagerViewSlot.add(view);
		this.pagerViewSlot.attached();
	}

	private resizeListener: any;
	unbind(){
		window.removeEventListener('resize', this.resizeListener);
	}

	headersSyncColumnHeadersWithColumns() {
		// Get the first row from the data if there is one...
		var cells = this.element.querySelectorAll("table>tbody>tr:first-child>td");

		for (var i = this.grid.gridHeaders.length - 1; i >= 0; i--) {
			var header = this.grid.gridHeaders[i];
			var filter = this.grid.gridFilters[i];
			var cell = cells[i];

			if(cell && header && filter) {
				var overflow = this.isBodyOverflowing();
				var tgtWidth = cell.offsetWidth + (i == this.grid.gridHeaders.length - 1 && overflow ? this.scrollBarWidth : 0);

				// Make the header the same width as the cell...
				header.setAttribute("style", "width: " + tgtWidth + "px");
				filter.setAttribute("style", "width: " + tgtWidth + "px");
			}
		};
	}

	isBodyOverflowing(): boolean {
		var container = this.grid.gridContainer;
		return container.offsetHeight < container.scrollHeight || container.offsetWidth < container.scrollWidth;
	}
}