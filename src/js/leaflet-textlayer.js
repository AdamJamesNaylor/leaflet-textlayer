import L from "leaflet";

import MediumEditor from "medium-editor";

import "../css/leaflet-textlayer.css";

/**
 * Dynamically updates the interactive state of a layer (including LayerGroups).
 * Taken from https://github.com/Leaflet/Leaflet/issues/5442#issuecomment-424014428
 */
L.Layer.prototype.setInteractive = function (interactive) {
    if (this.getLayers) {
        this.getLayers().forEach(layer => {
            layer.setInteractive(interactive);
        });
        return;
    }

    if (!this._container) {
        return;
    }

    this.options.interactive = interactive;

    if (interactive) {
        L.DomUtil.addClass(this._container, 'leaflet-clickable');
    } else {
        L.DomUtil.removeClass(this._container, 'leaflet-clickable');
    }
};

/**
 * @class TextLayer
 * @inherits Layer
 *
 * Leaflet plugin for creating text layers with configurable text editing support
 */
const TextLayer = L.Layer.extend({

    text: "",
    latlng: [],
    options: {
        enabled: true,
        marker: {},
        tooltip: {},
        divIcon: {}
    },
    isEnabled: true,
    addedToMap: false,

    initialize(text, latlng, options) {
        this.text = text;
        this.latlng = latlng;

        L.setOptions(this, options);
        if (!this.options.enabled)
            this.isEnabled = false;

        this._onAddCallback = this.options.onAddCallback ? this.options.onAddCallback : this._defaultOnAddCallback;
        this._onRemoveCallback = this.options.onRemoveCallback ? this.options.onRemoveCallback : this._defaultOnRemoveCallback;

        L.stamp(this);
    },
    setLatLng(latlng) {
        this.latlng = latlng;
        this.marker.setLatLng(latlng);
        return this;
    },
    setText(text) {
        this.text = text;
        if (!this.addedToMap)
            return;

        if (this.editor)
            this.editor.setContent(text);

        this.marker.setTooltipContent(text);
        this._setDivIcon();

        return this;
    },
    enable() {
        if (!this.options.enabled) {
            //we were disabled to begin with so quickly fire the callback
            this.options.enabled = true;
            this._onAddCallback();
        }

        this.tooltip.setInteractive(true);
        this._disablePropogation();
        this.isEnabled = true;

        return this;
    },
    disable() {
        this.tooltip.setInteractive(false);
        this._enablePropogation();
        this.isEnabled = false;

        return this;
    },
    onAdd(map) {

        this._tooltipOptions = this._createTooltipOptions();

        //add the marker (with tooltip) to map first so that we can later get the element's size
        this._addMarker(map);
            
        this._setDivIcon();

        this._onAddCallback(map);

        this.addedToMap = true;

        return this;
    },
    onRemove(map) {
        if (!this.addedToMap)
            return this;

        this._onRemoveCallback(map);

        if (this.marker) {
            map.removeLayer(this.marker);
            delete this.tooltip;
            delete this.marker;
        }

        this.addedToMap = false;

        return this;
    },
    _defaultOnAddCallback() {
        if (!this.options.enabled) {
            this.tooltip.setInteractive(false);
            return;
        }

        this.editor = new MediumEditor(".leaflet-textlayer-tooltip");
        this._disablePropogation();
    },
    _defaultOnRemoveCallback() {
        if (this.editor) {
            this.editor.destroy();
            delete this.editor;
        }
        this.tooltip.setInteractive(false);
        this._enablePropogation();
    },
    _stopPropogation(e) {
        console.log("stopping propogation");
        L.DomEvent.stopPropagation(e)
    },
    _enablePropogation() {
        let tooltipElement = this.tooltip.getElement();
        L.DomEvent.off(tooltipElement, "mousedown dblclick", this._stopPropogation);
        return this;
    },
    _disablePropogation() {
        //during mousedrag events, Leaflet calls disableTextSelection() which
        //prevents MediumEditor's events from firing correctly.
        //stopPropagation() here allows those events to fire correctly but prevents
        //Leaflet's behaviour when dragging etc.
        let tooltipElement = this.tooltip.getElement();
        L.DomEvent.on(tooltipElement, "mousedown dblclick", this._stopPropogation);
        return this;
    },
    /**
     * Applies user provided tooltip options over the defaults
     * and then applies the required options over those.
     */
    _createTooltipOptions() {
        let defaultTooltipOptions = { opacity: 1 }; //can be overridden
        
        let overriddenTooltipOptions = {...defaultTooltipOptions, ...this.options.tooltip}
        
        let requiredTooltipOptions = { permanent: true, direction: "bottom", interactive: true }; //cannot be overridden
        requiredTooltipOptions.className = "leaflet-textlayer-tooltip " + this.options.tooltip.className;

        //combine 
        return {...overriddenTooltipOptions, ...requiredTooltipOptions};
    },
    _addMarker(map) {
        this.marker = L.marker(this.latlng, this.options.marker);
        this.marker.addTo(map);
        this.marker.bindTooltip(this.text, this._tooltipOptions);

        this.tooltip = this.marker.getTooltip();

        //make sure child removal bubbles up to us
        this.marker.on("remove", () => this.onRemove(map));
        this.tooltip.on("remove", () => this.onRemove(map));
    },
    _setDivIcon() {
        //adjust position. Wouldn't be needed if we didn't have to use 'tooltips'
        //that are offset from where you click.
        let tooltipElement = this.tooltip.getElement();
        let tooltipSize = L.point(tooltipElement.offsetWidth, tooltipElement.offsetHeight);
        //[Can't use this because dragging re-adjust position to the wrong place]
        //var tooltipPosition = L.DomUtil.getPosition(tooltipElement);
        //var correctPosition = tooltipPosition.subtract(tooltipSize.scaleBy(L.point(0, 0.5)));
        //L.DomUtil.setPosition(tooltipElement, correctPosition);

        let iconAnchor = tooltipSize.scaleBy(L.point(0.5, 0));
        let divIconOptions = {
            iconAnchor: iconAnchor,
            iconSize: tooltipSize,
            className: "leaflet-textlayer-divicon " + this.options.divIcon.className
        };
        this.divIcon = L.divIcon({...this.options.divIcon, ...divIconOptions});
        this.marker.setIcon(this.divIcon);
    }
});

function textLayer(text, latlng, options) {
    return L.textLayer ? new TextLayer(text, latlng, options) : null;
}

L.TextLayer = TextLayer;
L.textLayer = textLayer;

export { TextLayer };
export { textLayer };
export default textLayer;