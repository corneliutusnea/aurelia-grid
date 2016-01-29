# Grid Data Source
The grid supports 3 types of data sources:
* `source-type="local"` - All the data is already present and you can give it to the grid immediatelly.
The grid will provide filtering, pagination and sorting including multi-column filtering.
* `source-type="delegate"` - The data retrival can be delegated to a function that will receive a callback
with information about the page, sorting and filtering.
* `source-type="remote"` - The data is retrieved from a remote URL. Filtering, pagination and sorting can be provided
by the server. 

## Local Data Source
Local data sources are used when ALL the data to be displayed in the grid is already available in the UI and it does not need to be from a remote source.
You can set `source-type="local"` on the grid (this is also the default).

You also have to set the `source-read.call="myLocalData()"` to the method returning data.
The method can return either an array of data or a `Promise` returning a result.
The result can either be in a format directly usable by the grid `{ data: [], count: number }` or any format that can be transformed
by the `source-transform` method.

** Grid Options ** 
* `source-type="local"` - configures the source of the data. (default is local).
Local data sources automatically provide in-memory sorting, filtering and pagination.
You can simply return the complete set of data in the `source-read`.
* `source-read.call="myLocalFunction()"` - The method that returns a promise to resolve the data for the grid.
The returned data can be either directly an array, structured data in format `{ data: [], count: number }` or any other structured data that
can be transformed to the `{ data: [], count: number }` by a `source-transform` method (see below). 
* `source-transform.call="myConvertFunction(data)"` - The method that can transform the data received into the format required for the grid.
If this function is declared then your `source-read` can return data in any format you want.
That data will be passed into `source-transform` to convert it to the format `{ data: [], count: number }`.
This allows you to use any existing data source that might be in an incorrect format and then adjust it as it's required.
* `source-loading-message="string"` - The text you want displayed while data is loading. (default is 'Loading ...')
* `no-data-message="string"` - Message to be displayed if there is no data. If this is set then the grid will not be displayed. (class="grid-no-data-message") 

### Examples
Return directly an array of data:
```html
<grid source-type="local" source-read.call="myLocalData()">
...
</grid>
```
```javascript
function myLocalData(){
	return ["john", "smith", "james"];
}
```
Return structured data:
```html
<grid source-type="local" source-read.call="myLocalData()">
...
</grid>
``` 
```javascript
function myLocalData(){
	return { data: ["john", "smith", "james"], count: 3};
}
```
Return data to be transformed:
```html
<grid source-read.call="myLocalData()" source-transform.call="transformData(data)">
...
</grid>
``` 
```javascript
function myLocalData(){
	return { myItems: ["john", "smith", "james"]};
}
function transformatData(mySource){
	return { data: mySource.myItems, count: mySource.myItems.length };
}
```

## Delegated Data Source
A delegated data source can be used when the data can be fetched in parts from a server or known in the UI but you
want to control the pagination, filtering and sorting.
You have to set `source-type="delegate"` on the grid.

You also have to set the `source-read.call="myLocalData(info)"` to the method returning data.

** Grid Options ** 
* `source-type="delegate"` - configures the source of the data to be delegated.
* `source-read.call="myLocalFunction(into)"` - The method that returns a promise to resolve the data for the grid.
The returned data can be either directly an array, structured data in format `{ data: [], count: number }` or any other structured data that
can be transformed to the `{ data: [], count: number }` by a `source-transform` method (see below).
The `info` parameter contains the details of the request that you need to fulfil: `{page: number, pageSize: number, sort: [ { field: string, sorting: string }, ... ]}`
   
   `page` - is the current page to be displayed. Starts at 1.
   
   `pageSize` - is the size of the page displayed
   
   `sort` - is an array of `{ field: string, sorting: string }` with the fields the data should be sorted by

* `source-supports-pagination="true|false"` - Flag to tell the grid if the delegated data source supports pagination (defaults to true).
If this is set to false, the [pagination details in the pager will be hidden](./pager.md).
* `source-supports-sorting="true|false"` - Flag to tell the grid if the delegated data source supports simple one-field sorting (defaults to true).
If the source does not support sorting, sorting will not be available in the column headers. 
* `source-supports-multi-column-sorting="true|false"` - Flag to tell the grid if the delegated data source supports simple sorting by multiple columns (defaults to false).
If the source does not support sorting on multiple columns at the same time, multi-column sorting will not be available in the column headers.
Simple one-column sorting might still be active based on the previous flag.
* `source-transform.call="myConvertFunction(data)"` - The method that can transform the data received into the format required for the grid.
If this function is declared then your `source-read` can return data in any format you want.
That data will be passed into `source-transform` to convert it to the format `{ data: [], count: number }`.
This allows you to use any existing data source that might be in an incorrect format and then adjust it as it's required.
* `source-loading-message="string"` - The text you want displayed while data is loading. (default is 'Loading ...')
* `no-data-message="string"` - Message to be displayed if there is no data. If this is set then the grid will not be displayed. (class="grid-no-data-message") 

## Remote Data Source
NOT YET IMPLEMENTED