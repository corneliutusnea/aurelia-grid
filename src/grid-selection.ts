import {Grid} from './grid';

export class GridSelection{
	private grid: Grid;
	constructor(grid: Grid){
		this.grid = grid;
	}
	
	select(item: any, event){
		// TODO: if multi-selection check event for shift pressed
		this.grid.selectedItem = item;
		return true;
	}
}