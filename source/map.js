"use strict";

document.addEventListener
(
	'DOMContentLoaded',
	function()
	{
		setUpTheUniverse();
	}
);

function setUpTheUniverse()
{
	const map = setUpMap();
	const pathPlacer = new PathPlacer(map);

	setUpMarkerPlacementControl(map, pathPlacer);
	setUpSaveMarkersControl(map, pathPlacer);
	setUpLoadMarkersControl(map, pathPlacer);
	setUpMarkerSearch(map);
	setUpViewStateSave(map);
}

function setUpMap()
{
	const map = createBaseMap();

	setUpLayers(map);

	return map;
}

function createBaseMap()
{
	const mapElementId = "map";

	const image = "images/catacombs.png";
	const width = 3000;
	const height = 3000;
	const bounds = [[0,0], [height, width]];

	const map = L.map
	(
		mapElementId,
		{
			crs: L.CRS.Simple,
			minZoom: -3,
			maxZoom: 3
		}
	);

	L.imageOverlay(image, bounds).addTo(map);
	L.control.scale
	(
		{
			maxWidth: 250,
			imperial: false,
			updateWhenIdle: false
		}
	).addTo(map);

	if (!loadViewState(map))
	{
		map.fitBounds(bounds);
	}

	return map;
}

function loadViewState(map)
{
	const savedLat = localStorage.getItem('mapCenterLat');
	const savedLng = localStorage.getItem('mapCenterLng');
	const savedZoom = localStorage.getItem('mapZoom');

	if (savedLat && savedLng && savedZoom)
	{
		const center = L.latLng(parseFloat(savedLat), parseFloat(savedLng));
		const zoom = parseInt(savedZoom);

		map.setView(center, zoom);

		return true;
	}

	return false;
}

function setUpLayers(map)
{
	const generalInformationLayerGroup = L.layerGroup(getGeneralInformationMarkers());
	const featureLayerGroup = L.layerGroup(getFeatureMarkers());
	const surfaceLayerGroup = L.layerGroup(getSurfaceMarkers());
	const transportationLayerGroup = L.layerGroup(getTransportationMarkers());
	const spiralStaircaseLayerGroup = L.layerGroup(getSpiralStaircaseMarkers());
	const maintenanceWellWithRungsLayerGroup = L.layerGroup(getMaintenanceWellWithRungsMarkers());
	const maintenanceWellWithoutRungsLayerGroup = L.layerGroup(getMaintenanceWellWithoutRungsMarkers());
	const communicationWellLayerGroup = L.layerGroup(getCommunicationWellMarkers());
	const wellsLayerGroup = L.layerGroup(getWellsMarkers());
	const ossuaryLayerGroup = L.layerGroup(getOssuaryMarkers());
	const curiosityLayerGroup = L.layerGroup(getCuriosityMarkers());
	const cartographicStatementsLayerGroup = L.layerGroup(getCartographicStatementsMarkers());
	const quarryLayerGroup = L.layerGroup(getQuarryMarkers());
	const streetNumbersLayerGroup = L.layerGroup(getStreetNumbersMarkers());
	const arcueilAqueductSpyholesLayerGroup = L.layerGroup(getArcueilAqueductSpyholesMarkers());
	const idcLayerGroup = L.layerGroup(getIdcMarkers());

	const overlayMaps =
		{
			"General information": generalInformationLayerGroup,
			"Feature information": featureLayerGroup,
			"Surface information": surfaceLayerGroup,
			"Transportation information": transportationLayerGroup,
			"Spiral staircase": spiralStaircaseLayerGroup,
			"Maintenance wells with rungs": maintenanceWellWithRungsLayerGroup,
			"Maintenance wells without rungs": maintenanceWellWithoutRungsLayerGroup,
			"Communication well": communicationWellLayerGroup,
			"Wells information": wellsLayerGroup,
			"Ossuary information": ossuaryLayerGroup,
			"Curiosity": curiosityLayerGroup,
			"Cartographic statements from IdC": cartographicStatementsLayerGroup,
			"Quarry information": quarryLayerGroup,
			"Street numbers": streetNumbersLayerGroup,
			"Arcueil Aqueduct Spyhole": arcueilAqueductSpyholesLayerGroup,
			"IdC information": idcLayerGroup
		};

	generalInformationLayerGroup.addTo(map);
	featureLayerGroup.addTo(map);
	surfaceLayerGroup.addTo(map);
	transportationLayerGroup.addTo(map);
	spiralStaircaseLayerGroup.addTo(map);
	maintenanceWellWithRungsLayerGroup.addTo(map);
	maintenanceWellWithoutRungsLayerGroup.addTo(map);
	communicationWellLayerGroup.addTo(map);
	wellsLayerGroup.addTo(map);
	ossuaryLayerGroup.addTo(map);
	curiosityLayerGroup.addTo(map);
	cartographicStatementsLayerGroup.addTo(map);
	quarryLayerGroup.addTo(map);
	streetNumbersLayerGroup.addTo(map);
	arcueilAqueductSpyholesLayerGroup.addTo(map);
	idcLayerGroup.addTo(map);

	L.control.layers(null, overlayMaps).addTo(map);
}

function setUpMarkerPlacementControl(map, pathPlacer)
{
	L.control.markerPlacement
	(
		{
			map: map,
			pathPlacer: pathPlacer
		}
	).addTo(map);
}

function setUpSaveMarkersControl(map, pathPlacer)
{
	L.control.markerSave
	(
		{
			pathPlacer: pathPlacer
		}
	).addTo(map);
}

function setUpLoadMarkersControl(map, pathPlacer)
{
	L.control.markerLoad
	(
		{
			pathPlacer: pathPlacer
		}
	).addTo(map);
}

function setUpMarkerSearch(map)
{
	let layerGroups = [];

	map.eachLayer
	(
		function(layer)
		{
			if (layer instanceof L.LayerGroup)
			{
				layerGroups.push(layer);
			}
		}
	);

	map.addControl
	(
		new L.Control.Search
		(
			{
				layer: L.layerGroup(layerGroups),
				initial: false,
				marker: false,
				zoom: 2
			}
		)
	);
}

function setUpViewStateSave(map)
{
	map.on('moveend', saveViewState);
	map.on('zoomend', saveViewState);
}

function saveViewState(map)
{
	const center = map.target.getCenter();
	const zoom = map.target.getZoom();

	localStorage.setItem('mapCenterLat', center.lat);
	localStorage.setItem('mapCenterLng', center.lng);
	localStorage.setItem('mapZoom', zoom);
}
