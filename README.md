# aurelia-grid
A fresh Aurelia Grid written in TypeScript based [charlespockert's Aurelia BS Grid](https://github.com/charlespockert/aurelia-bs-grid).

# Intro
This is a very early port of [charlespockert's Aurelia BS Grid](https://github.com/charlespockert/aurelia-bs-grid) to TypeScript.
This is very early proof of concept but seems to be working.

# Using the grid
1. Install the plugin into your project using jspm

  ```
  jspm install github:corneliutusnea/aurelia-grid
  ```
Note: I'm still missing the config for JSPM to install this package!
1. In order to import the plugin you need to be [manually bootstrapping Aurelia](http://aurelia.io/docs#startup-and-configuration).

  Open your `index.html` or equivalent and find your `aurelia-app` attribute and change it to:

  ```html
    <body aurelia-app="main">
  ```
1. Create a `main.js` file in your src directory and import the plugin using the `aurelia` configuration object

  ```javascript
  export function configure(aurelia) {
    aurelia.use
      .standardConfiguration()
      .developmentLogging()
      // Install the plugin
      .plugin('corneliutusnea/aurelia-grid');
    aurelia.start().then(a => a.setRoot());
  }
  ```
1. Since the plugin is globalized, you can use it by placing a `<grid>` custom element in any of your views:

  ```html
    <grid source-read.call="getSomeData($event)">
      <!-- Row template -->
      <grid-row>
        <!-- Column template(s) -->
        <grid-col heading="ID" field="id" class="col-md-6">${ $item.id }</grid-col>
        <grid-col heading="Name" field="name" class="col-md-6">${ $item.name }</grid-col>
      </grid-row>
    </grid>
  ```
You can specify the columns and their templates in-line in the markup. This gives you a view-friendly way of defining a data-grid so you can safely re-use your viewmodels.

## The Template
  ```html
  <!-- Grid plugin element -->
  <grid>
    <!-- Row template -->
    <grid-row>
      <!-- Columns -->
      <grid-col><!-- Column template --></grid-col>
      <grid-col><!-- Column template --></grid-col>
    </grid-row>
  </grid>
  ```
  
 You should provide a `<grid-row>` element and one or more child `<grid-col>` elements.

# &lt;grid-row&gt;
This represents a row of bound data. Any attributes applied to this element will be forwarded to the rows generated in the grid, so you can style your rows by applying classes to this element:

```html
<grid-row class="row-style">...
```

# &lt;grid-col&gt;
This represents a column in your grid - the same rules apply to grid columns in that any attributes will be forwarded to each grid cell that's generated.

## grid-col attributes
* **heading** - Title of the column
* **field** - Name of the field in the incoming item. Only required if the field supports sorting
* **class** - CSS Class for the column when rendering the item
* **header-class** - CSS class for the column header (the `th`)
* **can-sort="true|false"** - switch to allow sorting on this column. (default is false).
* **canFilter="true|false"** - switch to allow filtering on this column. (default is false)
* **sorting="asc|desc"** - can't be set by default but can be used in the template

## Grid Column - Row Templates
Anything between the column tags will be the column template. You can place any HTML markup in here and it will be picked up and compiled by Aurelia, so you can interpolate, attach event handlers, bind to expressions etc etc.
You can reference the current data row in the template by using the special `$item` field
**Example**
```html
<grid-column heading="Customer Name" field="customerName" class="col-md-6 col-customer-name" header-class="col-md-6" can-sort="true" can-filter="true">${item.customerName}</grid-column>
```

## Grid Column - Header Templates
You can also create custom templates for both header and row cell by adding two elements into the grid column `<heading>` and `<template>`:
```html
<grid-col can-sort="true" field="id" class="col-xs-1">
	<heading><strong>${$column.heading} - ${$column.sorting}</strong></heading>
	<template>${$item.id}</template>
</grid-col>
```
**Note**: If no `<template>` is found the grid will assume all your content is the row cell template.
The `heading="name"` attribute is ignored if a `<heading>` element is found inside the [`<grid-col>`](#grid-col) but it's filled in from the attributes list so you can still use it in your heading template.

Inside the Grid Heading Template you have access to the following properties
* **$column** - the current column with all its properties as defined above in `grid-col`
* **$grid** - direct reference to the grid. Best if you don't use this directly as the implementation can change.

## Default Grid Column Heading template is:
```html
<span class="grid-column-heading">${$column.heading}</span>
<span if.bind="$column.sorting === \'desc\'" class="glyphicon glyphicon-triangle-top text-primary"></span>
<span if.bind="$column.sorting === \'asc\'" class="glyphicon glyphicon-triangle-bottom text-primary"></span>
```


**Note:**
Each row will be in the scope of the `repeat` element, so in order to get back to your consuming viewmodel you need to jump up two levels (up to the `grid` scope then up to your viewmodel scope)

You can use `$parent` to reference the grid scope and `$parent.$parent` to get back to your viewmodel. Hopefully this won't be neccessary in later versions of Aurelia.

# Grid properties
The grid has several bindables which allow you to configure its behaviour:

## Grid Data Source

* **source-type="local|remote"** - configures the source of the data. (default is local).
Local data sources automatically provide in-memory sorting, filtering and pagination.
You can simply return the complete set of data in the `source-read`.
**NOTE:** remote is not yet working.
* **source-read.call="myLocalFunction(info)"** - The method that returns a promise to resolve the data for the grid.
The `info` will contain the pagination information which can be ignored if the source is local and pagination is done by the grid.
`info: { page: number, pageSize: number }` with `page = 1` being the first page.
You can return back data in either the format `{ data: [], count: number }` or any other format you like if you also provide a function for `source-transform`
* **source-transform.call="myConvertFunction(data)"** - The method that can transform the data received into the format required for the grid.
If this function is declared than your `source-read` can return data in any format you want. That data will be passed into `source-transform` to convert it to
the format `{ data: [], count: number }`.
This allows you to use any existing data source that might be in an incorrect format and then adjust it as it's required.
* **source-loading-message="string"** - The text you want displayed while data is loading. (default is 'Loading ...')
* **no-data-message="string"** - Message to be displayed if there is no data. If this is set then the grid will not be displayed. (class="grid-no-data-message") 

## Grid Local Data Source
Local data sources are used when the data is already available in the UI and it does not need to be fetched.
You can set `source-type="local"` at the grid (this is also the default).

You have to set the `source-read.call="myLocalData()"` to the method returning data.
The method can return either an array of data or a `Promise` returning a result.
The result can either be in a format directly usable by the grid `{ data: [], count: number }` or any format that can be transformed
by the `source-transform` method.

** Sample Methods **

Return directly an array of data:
```html
	<grid source-read.call="myLocalData()">
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
	<grid source-read.call="myLocalData()">
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

## Grid Properties

* **source-page-sizes="10, 25, 50"** - The list of paginations that should be available. WIP
* **columns-show-headers="true|false"** - Flag to turn the grid headers on/off (default is true)
* **columns-can-sort="true|false"** - Flag to turn the grid sorting on/off (default is true). You still need to turn on every column to be sortable!
* **columns-can-filter="true|false"** - Flag to turn the grid filters on/off (default is false). WIP


## Grid Selection
 
* **selected-item.two-way="selected"** - (two-way) Bind the selected row to your local `selected` property.
You can also create a method `selectedChanged(newValue)` that [Aurelia will automatically call when the `selected` property is changed](http://aurelia.io/docs.html#/aurelia/framework/1.0.0-beta.1.0.8/doc/article/cheat-sheet/8).
   
## Grid Methods

* **refresh()** - Force the grid to refresh immediatelly.
You can [get a reference to the grid accessible from your code](http://aurelia.io/docs.html#/aurelia/framework/1.0.0-beta.1.0.8/doc/article/cheat-sheet/5) using `grid.ref="mygrid"`.
```html
<grid grid.ref="myGrid" ...>
...
</grid>
```
```javascript
function doSomeWork(){
	this.myGrid.refresh();
}
```
