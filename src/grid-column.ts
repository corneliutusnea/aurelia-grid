import {ViewSlot, View} from 'aurelia-framework';

/** All Attributes on <grid-col  */
export class GridColumn{
	heading: string;
	field: string;
	class: string;
	headerClass: string;
	
	canSort: boolean;
	
	canFilter: boolean;
	filterPlaceholder: string;
	
	/** Value for filtering */
	filterValue: string;
	
	/** Full HTML template for the heading - either read from <heading>...</heading> or build from the heading attribute */
	headingTemplate: any;
	
	/** Cell template for rows */
	template: any;
	
	sorting: string;	// asc|desc
	
	// internal use
	slot: ViewSlot;
	view: View;
	
	init(){
		// we can accept the field to be null if the column has no sorting enabled
		if(this.canSort){
			if(!this.field){
				throw new Error(`field is required for column ${this.heading} if the column is sortable.`);
			}
		}
		if(this.canFilter && !this.filterPlaceholder)
			this.filterPlaceholder = "filter...";
	}
}