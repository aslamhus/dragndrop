# DragNDrop

A simple javascript drag and drop class.

**Disclaimer: this is very much a work in progress!**

## Installation

es6 import

```js
import DragNDrop from './DragNDrop.js';
```

As a script tag

```html
<script src="./DragNDrop.js"></script>
```

## Basic Usage

### HTML

DragNDrop requires HTML in the following format:

1. a containing `DIV` or other tag with any id. Here it is **item_list**.
2. children of the container with a consistent prefix followed by consecutive numbers. In this example the prefix is "item\_", followed by the numbers 1 through 5.

That's it!

```html
<div id="item_list">
  <div id="item_1">item1</div>
  <div id="item_2">item2</div>
  <div id="item_3">item3</div>
  <div id="item_4">item4</div>
  <div id="item_5">item5</div>
</div>
```

### Instantiate `DragNDrop`

Instantiate **DragNDrop** once the DOM has loaded. The `constructor` requires two parameters: first, the drag item prefix; and second, the selector for the drag container.

```js
import DragNDrop from '../DragNDrop.js';
const dragndrop = new DragNDrop('item_', '#item_list');
```

And you're ready to go!

## Constructor Parameters

| Parameter      | Type     | Description                                              | Required |
| -------------- | -------- | -------------------------------------------------------- | -------- |
| item prefix    | string   | the item id prefix                                       | yes      |
| drag container | string   | the selector of the drag container                       | yes      |
| callback       | function | callback that fires after a successful drag change event |          |
| dragBtn        | string   | selector for a drag button                               |          |
| axis           | string   | 'vertical' or 'horiztonal'                               |

## Examples

Checkout DragNDrp in action [https://aslamhus.github.io/dragndrop/test/](here).
