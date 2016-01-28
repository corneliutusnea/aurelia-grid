import {Grid} from './grid';
import {GridColumn} from './grid-column';

import {IGridDataSource, IGridData, IDataInfo, GridDataSource} from './grid-source';

/** Remote Source of Grid Data - Server side Paging and Sorting */
export class RemoteGridData extends GridDataSource {
	private dataRead: (event: IDataInfo) => Promise<any>;
}