"use strict";

function PathPlacer(map)
{
	this._map = map;
	this._path = new Path(this._map);
	this._isInMarkerPlacementMode = false;

	this.saveMarkers = function ()
	{
		const coordinates = this._path.getPathCoordinates();

		this._promptMarkerDownload
		(
			JSON.stringify(coordinates, null, 4),
			"markers-" + Date.now() + ".json"
		);
	}

	this.loadMarkers = function (markersCoordinates)
	{
		this._path.loadPath(markersCoordinates);
	}

	this.clearMarkers = function ()
	{
		this._path.clearMarkers();
	}

	this.placeMarker = function (lat, lng)
	{
		if (this._isInMarkerPlacementMode)
		{
			this._path.placeMarker(lat, lng);
		}
	}

	this.isInMarkerPlacementMode = function ()
	{
		return this._isInMarkerPlacementMode;
	}

	this.toggleMarkerPlacementMode = function ()
	{
		this._isInMarkerPlacementMode = !this._isInMarkerPlacementMode;
	}

	this.setMarkerPlacementMode = function (isActive)
	{
		this._isInMarkerPlacementMode = isActive;
	}

	this.removeMarker = function (marker)
	{
		this.removeMarker(marker);
	}

	this._promptMarkerDownload = function (data, filename)
	{
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');

		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	this.placeMarker = this.placeMarker.bind(this);
	this.isInMarkerPlacementMode = this.isInMarkerPlacementMode.bind(this);
	this.toggleMarkerPlacementMode = this.toggleMarkerPlacementMode.bind(this);
	this.setMarkerPlacementMode = this.setMarkerPlacementMode.bind(this);
	this.removeMarker = this.removeMarker.bind(this);
	this.clearMarkers = this.clearMarkers.bind(this);
	this.saveMarkers = this.saveMarkers.bind(this);
	this.loadMarkers = this.loadMarkers.bind(this);
}
