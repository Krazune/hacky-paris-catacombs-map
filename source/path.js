function Path(map)
{
	this._map = map;
	this._markers = [];
	this._connections = [];
	this._highlight = null;

	this._markerIcon = L.icon(
		{
			iconUrl: 'images/marker.png',
			iconSize:     [15, 15],
			iconAnchor:   [7, 7],
			shadowAnchor: [7, 7],
			popupAnchor:  [0, -15]
		}
	);

	this.placeMarker = function (lat, lng)
	{
		const newMarker = this._createMarker(lat, lng).addTo(this._map);
		const self = this;

		newMarker.on('click', function ()
		{
			self.removeMarker(newMarker);
		});

		this._markers.push(newMarker);
		this._updateHighlight();

		if (this._markers.length >= 2)
		{
			this._placeConnection(this._markers.length - 2);
		}
	}

	this.removeMarker = function (marker)
	{
		const markerIndex = this._markers.indexOf(marker);

		if (markerIndex === -1)
		{
			return;
		}

		const isLast = markerIndex === this._markers.length - 1;
		const isFirst = markerIndex === 0;

		this._map.removeLayer(marker);
		this._markers.splice(markerIndex, 1);

		if (!isLast)
		{
			this._connections[markerIndex].removeFrom(this._map);
			this._connections.splice(markerIndex, 1);
		}

		if (!isFirst)
		{
			this._connections[markerIndex - 1].removeFrom(this._map);
			this._connections.splice(markerIndex - 1, 1);
		}

		if (!isFirst && !isLast)
		{
			this._placeConnection(markerIndex - 1);
		}

		this._updateHighlight();
	}

	this.clearMarkers = function ()
	{
		this._resetMarkers();
		this._resetConnections();
		this._removeHighlight();
	}

	this.getPathCoordinates = function ()
	{
		let pathCoordinates = [];

		for (let i = 0; i < this._markers.length; ++i)
		{
			const latLng = this._markers[i].getLatLng();
			const coordinates =
			{
				lat: latLng.lat,
				lng: latLng.lng
			};

			pathCoordinates.push(coordinates);
		}

		return pathCoordinates;
	}

	this.loadPath = function (markersCoordinates)
	{
		this.clearMarkers();

		for (let i = 0; i < markersCoordinates.length; ++i)
		{
			this.placeMarker(markersCoordinates[i].lat, markersCoordinates[i].lng);
		}
	}

	this._updateHighlight = function ()
	{
		this._removeHighlight();

		if (this._markers.length === 0)
		{
			return;
		}

		// TODO: Early return can be done if the highlight is in the last position already, but I won't bother with that now.

		const lastMarkerLat = this._markers[this._markers.length - 1].getLatLng().lat;
		const lastMarkerLng = this._markers[this._markers.length - 1].getLatLng().lng;

		this._highlight = this._createHighlightCircle(
			lastMarkerLat,
			lastMarkerLng
		).addTo(this._map);
	}

	this._createMarker = function (lat, lng)
	{
		return L.marker(
			L.latLng(lat, lng),
			{
				icon: this._markerIcon
			}
		)
	}

	this._createHighlightCircle = function (lat, lng)
	{
		return L.circle(
			L.latLng(lat, lng),
			{
				color: "red",
				fillColor: "red",
				fillOpacity: 0.2,
				weight: 3,
				radius: 20
			}
		);
	}

	this._placeConnection = function (markerIndex)
	{
		const pointA = this._markers[markerIndex].getLatLng();
		const pointB = this._markers[markerIndex + 1].getLatLng();
		const newConnection = this._createConnectionLine(pointA, pointB);

		this._connections.splice(markerIndex, 0, newConnection);

		newConnection.addTo(this._map);
	}

	this._createConnectionLine = function (pointA, pointB)
	{
		return L.polyline(
			[pointA, pointB],
			{
				color: "red",
				weight: "3"
			}
		);
	}

	this._removeFromMap = function (collection)
	{
		for (let i = 0; i < collection.length; ++i)
		{
			collection[i].remove();
		}
	}

	this._resetMarkers = function ()
	{
		this._removeFromMap(this._markers);
		this._markers = [];
	}

	this._resetConnections = function ()
	{
		this._removeFromMap(this._connections);
		this._connections = [];
	}

	this._removeHighlight = function ()
	{
		if (this._highlight == null)
		{
			return;
		}

		this._highlight.remove();
		this._highlight = null;
	}

	this.placeMarker = this.placeMarker.bind(this);
	this.removeMarker = this.removeMarker.bind(this);
	this.clearMarkers = this.clearMarkers.bind(this);
	this.getPathCoordinates = this.getPathCoordinates.bind(this);
	this.loadPath = this.loadPath.bind(this);

	this._updateHighlight = this._updateHighlight.bind(this);
	this._createMarker = this._createMarker.bind(this);
	this._createHighlightCircle = this._createHighlightCircle.bind(this);
	this._placeConnection = this._placeConnection.bind(this);
	this._createConnectionLine = this._createConnectionLine.bind(this);
	this._removeFromMap = this._removeFromMap.bind(this);
	this._resetMarkers = this._resetMarkers.bind(this);
	this._resetConnections = this._resetConnections.bind(this);
	this._removeHighlight = this._removeHighlight.bind(this);
}
