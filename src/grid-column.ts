/** All Attributes on <grid-col  */
export class GridColumnProperties{
	heading: string;
	field: string;
	class: string;
	
	cansort: boolean;
	canfilter: boolean;
}

export class GridColumn{
	template: any;
	config: GridColumnProperties;
	
	/** config: GridColumnConfig, template: innerHtml template  */
	constructor(config: GridColumnProperties, template: any){
		this.config = config;
		this.template = template;
		
		// we can accept the field to be null if the column has no sorting enabled
		if(this.config.cansort){
			if(!this.config.field){
				throw new Error("field is required if the column is sortable.");
			}
		}
	}
}