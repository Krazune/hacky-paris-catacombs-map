"use strict";

L.Control.MarkerPlacement = L.Control.extend
(
	{
		options:
		{
			position: "topright",
			map: null,
			pathPlacer: null
		},
		onAdd: function ()
		{
			this._container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
			this._button = L.DomUtil.create("button", "leaflet-custom-button", this._container);
			this._button.innerHTML = "M";
			this._button.title = "Toggle Marker Placement Mode";
			this._map = this.options.map;
			this._pathPlacer = this.options.pathPlacer;

			L.DomEvent.disableClickPropagation(this._container);
			L.DomEvent.on(this._button, 'click', this._pathPlacer.toggleMarkerPlacementMode, this);

			this._map.on('click', (e) => { placeMarker(e, this._pathPlacer) }, this);

			return this._container;
		},
		onRemove: function ()
		{
			L.DomEvent.off(this._button, 'click', this._toggleMode, this);
			this._map.off('click', placeMarker, this);
		}
	}
);

L.control.markerPlacement = function (options)
{
	return new L.Control.MarkerPlacement(options);
};

function placeMarker(e, pathPlacer)
{
	pathPlacer.placeMarker(e.latlng.lat, e.latlng.lng);
}
