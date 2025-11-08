"use strict";

L.Control.MarkerLoad = L.Control.extend
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
			this._button.innerHTML = "L";
			this._button.title = "Load Markers";
			this._pathPlacer = this.options.pathPlacer;

			L.DomEvent.disableClickPropagation(this._container);
			L.DomEvent.on(this._button, 'click', (e) => { loadMarkersFromJson(e, this._pathPlacer) }, this);

			return this._container;
		},
		onRemove: function ()
		{
			L.DomEvent.off(this._button, 'click', (e) => { loadMarkersFromJson(e, this._pathPlacer) }, this);
		}
	}
);

L.control.markerLoad = function (options)
{
	return new L.Control.MarkerLoad(options);
};

function loadMarkersFromJson(e, pathPlacer)
{
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = '.json';
	fileInput.style.display = 'none';

	fileInput.addEventListener
	(
		'change',
		(event) =>
		{
			const file = event.target.files[0];

			if (file)
			{
				processMarkersFile(file, pathPlacer);
			}

			document.body.removeChild(fileInput);
		}
	);

	document.body.appendChild(fileInput);
	fileInput.click();
}

function processMarkersFile(file, pathPlacer)
{
	const reader = new FileReader();

	reader.onload = (e) =>
	{
		try
		{
			const jsonString = e.target.result;
			const coordinates = JSON.parse(jsonString);
			const wasInMarkerPlacementMode = pathPlacer.isInMarkerPlacementMode();

			pathPlacer.setMarkerPlacementMode(true);
			pathPlacer.loadMarkers(coordinates)
			pathPlacer.setMarkerPlacementMode(wasInMarkerPlacementMode);
		}
		catch (error)
		{
			console.error("Error parsing JSON: ", error);
		}
	};

	reader.readAsText(file);
}
