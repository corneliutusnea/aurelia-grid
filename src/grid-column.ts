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
	template: any;
		
	/** config: GridColumnConfig, template: innerHtml template  */
	constructor(template: any){
		this.template = template;
		

		// copy all properties into "us"
	}
	
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