# Leaflet TextLayer plugin

This plugin adds support to [Leaflet](https://leafletjs.com/) for text layers with optional and extensible text editing.

## Requirements

Tested with [Leaflet v1.6.0](https://leafletjs.com/reference-1.6.0.html) in Chrome 83.  

This plugin comes bundled with [MediumEditor v5.23.3](https://yabwe.github.io/medium-editor/) as it's default text editor which can be swapped out by the user.

Tested to support [Geoman v2.4.0](https://geoman.io/).

## Demo

## Installation

### npm

This plugin is provided as an [npm package](https://www.npmjs.com/package/leaflet-textlayer) which you can install as follows:

```
npm install leaflet-textlayer
```

### Include as an ES6 module

```javascript
import TextLayer from "leaflet-textlayer";
```

## Usage example

```javascript
import TextLayer from "leaflet-textlayer";

//...

const map = L.map("map")
  .setView([51.505, -0.09], 13);

let myLayer = new TextLayer("Some text", [51.505, -0.09])
    .addTo(map);
```

### Options

Internally, the TextLayer creates a [Marker](https://leafletjs.com/reference-1.6.0.html#marker) with a [DivIcon](https://leafletjs.com/reference-1.6.0.html#divicon) and then binds a [Tooltip](https://leafletjs.com/reference-1.6.0.html#tooltip) to it to show the text. This create both an icon in Leaflet's icon pane, and a tooltip in the tooltip pane. You can specify options for each by adding them to the options object as follows:

```javascript
let options = {
    marker: {},
    tooltip: {},
    divIcon: {},
};

let textLayer = new TextLayer("Some text", [0, 0], options);
```

These options are passed as-is to the respective layers, with the following exceptions:
- Tooltip's `opacity` option defaults to `1` but can be overridden by setting `options.tooltip.opacity`.
- Tooltip's `permanent`, `direction`, and `interactive` options can not be overriden and are hardcoded to `true`, `bottom`, and `true` respectively.
- `className` can be specified for each layer but will include `leaflet-textlayer-tooltip` and `leaflet-textlayer-divicon` for the `tooltip` and `divIcon` respectively.
- `divIcon` will set it's own `iconAnchor` and `iconSize` and therefore cannot be directly overridden.

### Text editor

By default, the TextLayer supports text editing via [MediumEditor](https://yabwe.github.io/medium-editor/). This behaviour can be disabled by passing `enabled: false` as a property of the options object.

```javascript
let myLayer = new TextLayer("Some text", [51.505, -0.09], {enabled: false});
```

### Custom text editor

The TextLayer supports custom editors. To achieve this the TextLayer will call a callback that you can provide which will override the default behaviour. This callback will be called from Leaflet's `onAdd()` method once the layer is added to the map.

```javascript
function myOnAddCallback(map) {
    //initiate a custom editor
}

let myLayer = new TextLayer("Some text", [51.505, -0.09], {onAddCallback: myOnAddCallback});
```

If you perform initialisation code within a custom `onAddCallback` you may need to clean up that initialisation. To support this, the TextLayer will call an `onRemoveCallback` when the layer is removed from a map. You can override this in the same way.

```javascript
function myOnRemoveCallback(map) {
    //tear down
}

let myLayer = new TextLayer("Some text", [51.505, -0.09], {onRemoveCallback: myOnRemoveCallback});
```

Here is a comprehensive list of JavaScript WYSIWYG editors
https://github.com/JefMari/awesome-wysiwyg

Only MediumEditor is officially supported.


## API reference
See the [Leaflet API documentation](https://leafletjs.com/reference-1.6.0.html) for information on Leaflet specific types.

### Creation

|Code|Returns|Description|
|----|-------|-----------|
|`new TextLayer(<String> text, <LatLng> latlng, <Options> options?)`|A newly constructed TextLayer|Creates a new TextLayer instance with the provided text at the provided latlng position. The options parameter is optional.

### Options

The options parameter lets you customise the way the layer looks and behaves. It supports the following properties.

|Property|Type|Default|Description|
|---|---|---|---|
|`enabled`|`Boolean|String`|`true`|When passed in as an option, this allows you to disable text editing entirely and the layer will behave as read only text.
|`onAddCallback`|`function`|Internally defined|Prevents the default editor creation from being called and swaps it with custom behaviour.|
|`onRemoveCallback`|`function`|Internally defined|Prevents the default editor destruction from being called and swaps it with custom behaviour.|
|`marker`|`object`|`{}`|Allows custom options to be passed to the [Marker](https://leafletjs.com/reference-1.6.0.html#marker) created by the TextLayer.|
|`tooltip`|`object`|`{}`|Allows custom options to be passed to the [Tooltip](https://leafletjs.com/reference-1.6.0.html#tooltip) created by the TextLayer.|
|`divIcon`|`object`|`{}`|Allows custom options to be passed to the [DivIcon](https://leafletjs.com/reference-1.6.0.html#divicon) created by the TextLayer.|
|`editor`|`object`|`{}`|Allows custom options to be passed to the default [MediumEditor](https://github.com/yabwe/medium-editor/blob/master/OPTIONS.md) created by the TextLayer.|

### Properties

|Property|Type|Default|Description|
|---|---|---|---|
|`text`|`String`|`""`|The text currently being displayed in the layer. To change this value call the `setText()` method.|
|`latlng`|`LatLng`|`[]`|The current position of the layer. To change this value call the `setLatLng()` method.|
|`options`|`Object`|See Options section|The options currently applied to the TextLayer. Changing these will not dynamically update the TextLayer. See the Methods section for values that can be dynamically changed after creation.|
|`isEnabled`|`Boolean`|`true`|Returns whether this layer is enabled for text editing. Can only be assigned via `enable()` and `disabled()`.|
|`addedToMap`|`Boolean`|`false`|Returns `true` once the layer is added to a leaflet map.|
|`marker`|`Marker`|`undefined`|The Marker created during `onAdd()`|
|`tooltip`|`Tooltip`|`undefined`|The Tooltip created during `onAdd()`|
|`divIcon`|`DivIcon`|`undefined`|The DivIcon created during `onAdd()`|
|`editor`|`MediumEditor`|`undefined`|If using the default editor this property will be the initialised MediumEditor created during `onAdd`.|

### Methods

|Method|Returns|Description|
|---|---|---|
|`setText(<String> text)`|`this`|Updates the text of the layer.|
|`setLatLng(<LatLng> latlng)`|`this`|Updates the latlng of the layer.|
|`enable()`|`this`|Enables text editing for this layer.|
|`disable()`|`this`|Disables text editing for this layer.|

## Known issues

|Issue|Work around|
|-----|-----------|
|Selecting text and then clicking outside of the layer will not deselect the text.|Deselect the text first by clicking inside the text layer once (without dragging) and then clicking outside.|
|Text is displayed slightly below the latlng when added.|Possibly could be corrected with CSS but care must be taken with click regions for the marker layer.|