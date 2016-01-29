import {GridColumn} from './grid-column';
import {GridRowAttributes} from './grid-row';
import {GridPager} from './grid-pager';
import {LogManager} from 'aurelia-framework';

export interface GridTemplate {
	columns: GridColumn[];
	rowAttributes: GridRowAttributes;
	pager: GridPager;
}

/** Helper to do the parsing of the grid content */
export class GridParser {
	parse(element: any): GridTemplate {
		var result = {
			columns: this.parseGridCols(element),
			rowAttributes: this.parseGridRow(element),
			pager: this.parseGridPager(element)
		};

		return result;
	}
	private parseGridCols(element: any): GridColumn[] {
		var rowElement = element.querySelector("grid-row");
		if(!rowElement){
			LogManager.getLogger("aurelia-grid").warn("Grid has no <grid-row> defined");
			return [];
		}
		var columnElements = Array.prototype.slice.call(rowElement.querySelectorAll("grid-col"));
		var cols = [];

		var columnTemplate =
			'<span class="grid-column-heading">${$column.heading}</span>' +
			'<span if.bind="$column.sorting === \'desc\'" class="${$grid.icons.sortingDesc}"></span>' +
			'<span if.bind="$column.sorting === \'asc\'" class="${$grid.icons.sortingAsc}"></span>';

		// <grid-col can-sort="true" heading="header"> ..
		// or <grid-col can-sort="true"><heading>header template</heading><template>cell template</template> 
		columnElements.forEach(c => {
			var col = new GridColumn();

			var attrs = Array.prototype.slice.call(c.attributes);
			attrs.forEach(a => col[this.camelCaseName(a.name)] = a.value);

			// check for inner <heading> of template
			var headingTemplate = c.querySelector("heading");
			col.headingTemplate = (headingTemplate && headingTemplate.innerHTML) ? headingTemplate.innerHTML : columnTemplate;
		
			// check for inner content of <template> or use full content as template
			var cellTemplate = c.querySelector("template");
			col.template = (cellTemplate && cellTemplate.innerHTML) ? cellTemplate.innerHTML : c.innerHTML;

			col.init();
			cols.push(col);
		});

		return cols;
	}
	
	private parseGridRow(element: any): GridRowAttributes {
		// Pull any row attrs into a hash object
		var rowsAttributes = new GridRowAttributes();

		var rowElement = element.querySelector("grid-row");
		if(!rowElement){
			LogManager.getLogger("aurelia-grid").warn("Grid has no <grid-row> defined");
			return rowsAttributes;
		}
		
		var attrs = Array.prototype.slice.call(rowElement.attributes);
		attrs.forEach(a => rowsAttributes[a.name] = a.value);

		return rowsAttributes;
	}

	private parseGridPager(element: any): GridPager {
		var pagerElement = element.querySelector("grid-pager");
		var pager = new GridPager();
		if(!pagerElement){
			return pager;
		}
		// fill in all properties
		var attrs = Array.prototype.slice.call(pagerElement.attributes);
		attrs.forEach(a => pager[this.camelCaseName(a.name)] = a.value);
		
		var template = pagerElement.querySelector("template");
		pager.template = (template && template.innerHTML) ? template.innerHTML : null;
		
		return pager;
	}

	private camelCaseName(name: string): string {
		return name.replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
	};
}