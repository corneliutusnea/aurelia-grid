import {Grid} from './grid';
import {GridColumn} from './grid-column';

export interface IGridDataSource {
	supportsPagination: boolean;
	supportsSorting: boolean;
	supportsMultiColumnSorting: boolean;
		
	count: number;
	items: any[];
	loading: boolean;

	/** 1 - first page */
	page: number;
	/** 10 - default page size */
	pageSize: number;
	pageCount: number;
	
	/** Dictionary of sorting name:asc|desc  */
	sorting: Array<GridColumn>;
	
	/** grid was attached - start loading & monitoring for changes */
	attached();
	/** trigger a refresh */
	refresh();
	/** unbind - stop loading and monitoring for changes */
	unbind();
	
	/** Trigger a sort changed - FIX: event for now is the click event */
	sortChanged(column: GridColumn, event);
}

/** Shape of the result data */
export interface IGridData {
	count: number;
	data: any[];
}

/** Used in the read callback to ask the local data source for data */
export interface IDataInfo {
	/** 1 - first page */
	page: number;
	/** 10 - default page size */
	pageSize: number;
    /** sort information */
    sort: IDataSortInfo[];
}

export interface IDataSortInfo{
    field: string;
    sorting: string;    // asc|desc
}

export class GridDataSource implements IGridDataSource {
	supportsPagination: boolean = false;
	supportsSorting: boolean = false;
	supportsMultiColumnSorting: boolean = false;
	
	count: number;
	items: any[];
	loading: boolean;

	page: number = 1;
	pageSize: number;
	pageCount: number = 0;

	sorting: Array<GridColumn> = new Array<GridColumn>();

	protected grid: Grid;

	constructor(grid: Grid) {
		this.grid = grid;
	}
	

	attached() {
		this.page = 1;

		if (this.grid.pager && this.grid.pager.pageSizes)
			this.pageSize = this.grid.pager.pageSizes[0];
		else
			this.pageSize = 10;
		
		// process page sizes
		if (this.grid.sourceAutoLoad) {
			this.refresh();
		}
	}
	refresh() {
		debugger;
		throw new Error("Data source does not implement read?");
	}

	updatePager() {
		// TODO: 
	}

	onData() {
		if (this.pageSize == 0)
			this.pageSize = 10;
		this.pageCount = Math.ceil(this.count / this.pageSize);
		this.grid.pager.refresh();
	}

	unbind() {
	}
	
	/** Events from Aurelia */
	pageSizeChanged(newValue: number, oldValue: number) {
		debugger;
		if(newValue == oldValue)
			return;
		this.refresh();
	}
	
	/** ============ Sorting ============== */
	sortChanged(column: GridColumn, event) {
		// Determine new sort
		var newSort = undefined;

		// Figure out which way this field should be sorting
		switch (column.sorting) {
			case "asc":
				newSort = "desc";
				break;
			case "desc":
				newSort = "";
				break;
			default:
				newSort = "asc";
				break;
		}

		if (!event.ctrlKey || !this.supportsMultiColumnSorting) {
			this.sorting.forEach(s=> s.sorting = "");
			this.sorting = [];
		}

		column.sorting = newSort;

		// If the sort is present in the sort stack, slice it to the back of the stack, otherwise just add it
		var pos = this.sorting.indexOf(column);

		if (pos > -1)
			this.sorting.splice(pos, 1);

		if (newSort)
			this.sorting.push(column);

		// Apply the new sort
		this.refresh();
	}
} 
