"use strict";

L.Control.MarkerSave = L.Control.extend
(
	{
		options:
		{
			position: "topright",
			pathPlacer: null
		},
		onAdd: function ()
		{
			this._container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
			this._button = L.DomUtil.create("button", "leaflet-custom-button", this._container);
			this._button.innerHTML = "S";
			this._button.title = "Save Markers";
			this._pathPlacer = this.options.pathPlacer;

			L.DomEvent.disableClickPropagation(this._container);
			L.DomEvent.on(this._button, 'click', (e) => { saveMarkersToJson(e, this._pathPlacer) }, this);

			return this._container;
		},
		onRemove: function ()
		{
			L.DomEvent.off(this._button, 'click', (e) => { saveMarkersToJson(e, this._pathPlacer) }, this);
		}
	}
);

L.control.markerSave = function (options)
{
	return new L.Control.MarkerSave(options);
};

function saveMarkersToJson(e, pathPlacer)
{
	pathPlacer.saveMarkers();
}
