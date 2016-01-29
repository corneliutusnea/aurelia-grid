# Aurelia Grid Pager Component
The grid provides its default pager that supports first/last, current page, incremental next/back pages, a page sizes selector and
a grid summary. The visibiliy of each part of the pager can be configured through various flags.
The pager can also be completly overwritten with your own custom pager.

Format of the pager
```
[First] [...] [<<] [1] [2] [**3**] [4] [5] [>>] [...] [Last]		[10 ] items per page	Showing 20 - 30 of 10000 items
```

## Default Pager Properties
To control the various properties of the pager you need to declare the `grid-pager` element:
```html
<!-- Grid plugin element -->
<grid>
   	...
	<grid-pager num-pages-to-show="5" ...>
	</grid-pager>
</grid>
 ```

* `num-pager-to-show="5"` - Number of pages to show around the current page `[1] .. [5]`
* `show-first-last="true|false"` - Wherever to show the `[First]` and `[Last]` links
* `show-jump="true|false"` - Wherever to show the `[...]` jump links
* `show-paging-summary="true|false"` - Wherever to show the summary `Showing 20 - 30 of 10000 items`
* `page-sizes="[10, 25, 50]"` - The options in the pagination control

Note: Pagination is automatically hidden if your [selected data source](./datasource.md) does not support pagination. 

## Custom Pager Template
In Aurelia Grid you can easily build your own pager based on your own needs and design.

```html
<grid-pager>
	<template>This is my custom pager. Current page ${$source.page}. 
		<a href="" click.delegate="$pager.prev()">Previous Page</a>
		<a href="" click.delegate="$pager.next()">Next Page</a>
		There are ${$source.count} rows.
	</template>
</grid-pager>
```
The following properties are available for your pager to use:

** $pager ** Current Pager Information 
* `$pager.numPagesToShow` -  Number of pages to show around the current page
* `$pager.showFirstLast` - Wherever to show the `[First]` and `[Last]` links
* `$pager.showJump` - Wherever to show the `[...]` jump links
* `$pager.showPagingSummary` - Wherever to show the summary
* `$pager.pageSizes` - Array of defined page sizes.
* `$pager.prevDisabled` - `[Prev]` should be disabled 
* `$pager.nextDisabled` - `[Next]` should be disabled
* `$pager.firstVisibleItem` - `[x]` First visible page number around current page 
* `$pager.lastVisibleItem` - `[x]` Last visible page number around current page.
* `$pager.first()` - Go to first page (`click.delegate="$pager.first()"`)
* `$pager.prevJump()` - Previous jump `[...]`
* `$pager.prev()` - Go to previous page
* `$pager.changePage(pageNumber)` - Go to pageNumber
* `$pager.next()` - Go to next page
* `$pager.nextJump()` - Next jump `[...]`
* `$pager.last()` - Go to last page

** $source ** Current Data Source Information
* `$source.supportsPagination` - Wherever the source supports pagination or not 
* `$source.count` - Total number of items in the source
* `$source.loading` - true when the source is loading data. false otherwise
* `$source.page` - Current page number (starts at 1)
* `$source.pageSize` - Size of the page
* `$source.pageCount` - Total number of pages

** $grid ** Reference to the parent grid.
* `$grid.pageSize` - You need to bind THIS value in order for the page size to be correctly changed.
This might change in the future.
