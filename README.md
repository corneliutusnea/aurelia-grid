# aurelia-grid

[![Join the chat at https://gitter.im/corneliutusnea/aurelia-grid](https://badges.gitter.im/corneliutusnea/aurelia-grid.svg)](https://gitter.im/corneliutusnea/aurelia-grid?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
A fresh Aurelia Grid written in TypeScript based [charlespockert's Aurelia BS Grid](https://github.com/charlespockert/aurelia-bs-grid).

[![Gitter](https://badges.gitter.im/corneliutusnea/aurelia-grid.svg)](https://gitter.im/corneliutusnea/aurelia-grid?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

# Intro
This is an early build of an Aurelia Grid based on an original implementation by [charlespockert's Aurelia BS Grid](https://github.com/charlespockert/aurelia-bs-grid).

Features:
* Column Header Templates
* Row Cell Templates
* Pagination
* Single column and Multi Column Sorting
* Local Data Source and Delegated data source
* Pager with custom Pager Templates

Upcoming Features:
* Remote Data Source
* Multi-Select
* Column Filters

# Documentation
* [Using the grid](#using-the-grid)
* [Template](#the-template)
	* [grid-row](#grid-row)
	* [grid-col](#grid-col)
		* [column header template](grid-column---header-templates)
		* [cell templates](#grid-column---row-templates)
	* [pager](#grid-pager)
		* [pager customization](docs/pager.md)
* [Data Sources](#grid-data-source)
	* [Local Data Source](docs/datasource.md#local-data-source)
	* [Delegated Data Source](docs/datasource.md#delegated-data-source)
* [Grid Selection](#grid-selection)
* [Grid Methods](#grid-methods)


# Using the grid
1. Install the plugin into your project using jspm
  ```
  jspm install github:corneliutusnea/aurelia-grid
  ```
  Note: I'm still missing the config for JSPM to install this package!
  Alternatively (if you are using webpack) you can install the package using `npm`
  ```
  npm install aurelia-grid
  ```
2. In order to import the plugin you need to be [manually bootstrapping Aurelia](http://aurelia.io/docs#startup-and-configuration).

  Open your `index.html` or equivalent and find your `aurelia-app` attribute and change it to:

  ```html
    <body aurelia-app="main">
  ```
3. Create a `main.js` file in your src directory and import the plugin using the `aurelia` configuration object

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
	<!-- Optional Grid Pager options -->
	<grid-pager>
	</grid-pager>
</grid>
```
 
You should provide a `<grid-row>` element and one or more child `<grid-col>` elements.

# &lt;grid-row&gt;
This represents a row of bound data. Any attributes applied to this element will be forwarded to the rows generated in the grid, so you can style your rows by applying classes to this element:

```html
<grid-row class="row-style" other-attribute="true">...
```
This will generate the following grid rows:
```html
<tr class="my-custom-row au-target" other-attribute="true">...</tr>
```
(Few extra grid specific attributes will be added to the row.)  


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
You can use `$grid` to reference the grid scope and `$p` to get back to your own viewmodel.

# Grid Data Source
The grid supports 3 types of data sources:
* `source-type="local"` - All the data is already present and you can give it to the grid immediatelly.
The grid will provide filtering, pagination and sorting including multi-column filtering.
* `source-type="delegate"` - The data retrival can be delegated to a function that will receive a callback
with information about the page, sorting and filtering.
* `source-type="remote"` - The data is retrieved from a remote URL. Filtering, pagination and sorting can be provided
by the server. 

[Read the complete Data Source documentation](./docs/datasource.md) for details on how each data source can be configured.

## Grid Properties
* `source-page-sizes="[10, 25, 50]"` - The list of paginations that should be available. WIP
* `columns-show-headers="true|false"` - Flag to turn the grid headers on/off (default is true)
* `columns-can-sort="true|false"` - Flag to turn the grid sorting on/off (default is true). You still need to turn on every column to be sortable!
* `columns-can-filter="true|false"` - Flag to turn the grid filters on/off (default is false). WIP

## Grid Pager
The grid provides its default pager that supports first/last, current page, incremental next/back pages, a page sizes selector and
a grid summary. The visibiliy of each part of the pager can be configured through various flags.
The pager can also be completly overwritten with your own custom pager.

[Read the complete Grid Pager documentation](./docs/pager.md) for details on how the pager can be configured or customized.


## Grid Selection
* **selected-item.two-way="selected"** - (two-way) Bind the selected row to your local `selected` property.
You can also create a method `selectedChanged(newValue)` that [Aurelia will automatically call when the `selected` property is changed](http://aurelia.io/docs.html#/aurelia/framework/1.0.0-beta.1.0.8/doc/article/cheat-sheet/8).
   
## Grid Methods
* **refresh(resetPage?:boolean)** - Force the grid to refresh immediatelly. Optional `boolean` paramter to reset the grid back to page 0.
You can [get a reference to the grid accessible from your code](http://aurelia.io/docs.html#/aurelia/framework/1.0.0-beta.1.0.8/doc/article/cheat-sheet/5) using `grid.ref="mygrid"`.
```html
<grid grid.ref="myGrid" ...>
...
</grid>
```
Then from your code you can call the grid to request a refresh.
A refresh always maintains the current filters, pagination and sorting.
```javascript
function doSomeWork(){
	this.myGrid.refresh();
}
```

## Grid Icons
The grid is using by default the icons from [font-awesome](fontawesome.io/icons/).
All the icons are defined in the `grid-icons.js` file. You can replace the grid icons by setting a different `grid.icons`.

  ```
  var myIcons = {
    refresh: "fa fa-refresh",
    sortingAsc: "fa fa-sort-asc text-primary",
    sortingDesc: "fa fa-sort-desc text-primary",
    firstPage: "fa fa-step-backward",
    firstPageTitle: "First page",
    prevPage: "fa fa-caret-left",
    prevPageTitle: "Previous page",
    nextPage: "fa fa-caret-right",
    nextPageTitle: "Next page",
    lastPage: "fa fa-step-forward",
    lastPageTitle: "Last page",
  }
  this.grid.icons = myIcons;
  ```