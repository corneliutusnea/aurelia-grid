import {Grid} from './grid';
import {GridColumn} from './grid-column';

import {IGridDataSource, IGridData, IDataInfo, GridDataSource} from './grid-source';

/** Remote Source of Grid Data via a function */
export class DelegateGridData extends GridDataSource {
	private dataRead: (event: IDataInfo) => Promise<any>;

	constructor(grid: Grid) {
		super(grid);
		
		this.supportsPagination = this.grid.sourceSupportsPagination;
		this.supportsSorting = this.grid.sourceSupportsSorting;
		this.supportsMultiPageSorting = this.grid.sourceSupportsMultiPageSorting;
	}
	
	refresh() {
		this.loading = true;
		var d = this.dataRead({
			page: this.page,
			pageSize: this.pageSize
		}).then(result=> {
			this.handleResult(result);
			this.loading = false;
		}).catch(error=> {
			if (this.grid.sourceReadError)
				this.grid.sourceReadError(error);
			this.loading = false;
		})
	}

	private handleResult(result: any, isArray: boolean = false) {
		var r: IGridData;
		if (this.grid.sourceTransform)
			r = this.grid.sourceTransform(result);
		else {
			if (isArray) {
				r = { data: result, count: result.length };
			} else {
				r = <IGridData>result;
			}
		}

		if (r) {
			this.count = r.count;
			this.items = r.data;
		}
		this.onData();
	}
}