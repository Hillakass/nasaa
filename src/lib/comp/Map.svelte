<script>
	import mapboxgl from 'mapbox-gl'
	import Search from '$lib/comp/Search.svelte'
	import { onMount } from 'svelte';
	import { bbox } from '@turf/turf';
	import { selectedDistrictId } from '$lib/store.js'

	let dialog
	let opened = false
	let showIcons = true;
	let showHeatmap = true;
	let map;
	function toggleIcons(event) {
        showIcons = event.target.checked;
		//showHeatmap = false;
        //map.setLayoutProperty('geojsonLayer', 'visibility', showIcons ? 'visible' : 'none');
		updateMapLayers();
    	}
		function toggleHeatmap(event) {
        showHeatmap = event.target.checked;
        //showIcons = false; // Ocultar los iconos si se muestra el mapa de calor
        updateMapLayers();
    }
	function updateMapLayers() {
		
		map.setLayoutProperty('geojsonLayer', 'visibility',showIcons? 'visible' : 'none');
        map.setLayoutProperty('heatmapLayer', 'visibility',showHeatmap? 'visible' : 'none');
    }
	onMount(() => {
		// Mapbox access token
		mapboxgl.accessToken = 'pk.eyJ1IjoicC1wYXNjYWwiLCJhIjoiY20wcHBsbWNpMDNqZzJpb2RvY2o4Y3lieSJ9.qXJ0kOaYERtJ22_Gzd7s-g';

		// Initialize the map
		map = new mapboxgl.Map({
				container: 'map',
				style: 'mapbox://styles/mapbox/dark-v11',
				center: [-71, -16],
				zoom: 5
		});
		// Fetch data from the API
		async function fetchData() {
				const MAP_KEY = 'af61b5158d90f9fbe8bd0f49b87d8576';
				const url = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${MAP_KEY}/MODIS_NRT/PER/4`;

				try {
						const response = await fetch(url);
						const textData = await response.text();
						const csvData = csvToArray(textData);
						return csvData;
				} catch (error) {
						console.error("Error fetching data:", error.message);
						return null;
				}
		}

		// Convert CSV to array of objects
		function csvToArray(str, delimiter = ",") {
				const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
				const rows = str.slice(str.indexOf("\n") + 1).split("\n");

				return rows.map(row => {
						const values = row.split(delimiter);
						const obj = headers.reduce((acc, header, index) => {
								acc[header.trim()] = values[index] ? values[index].trim() : null;
								return acc;
						}, {});
						return obj;
				}).filter(row => row.latitude && row.longitude);  // Filter out empty rows
		}

		// Convert data to GeoJSON
		function dfToGeoJSON(data) {
				const features = data.map(row => ({
						type: "Feature",
						geometry: {
								type: "Point",
								coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
						},
						properties: {
								brightness: parseFloat(row.brightness),
								acq_date: row.acq_date,
								acq_time: row.acq_time,
								satellite: row.satellite.toString(),
								confidence: parseFloat(row.confidence)
						}
				}));

				return {
						type: "FeatureCollection",
						features: features
				};
		}

		// Add GeoJSON data to the map as a layer
		function addGeoJSONLayerToMap(geojsonData) {
				if (map.getSource('geojsonData')) {
						map.getSource('geojsonData').setData(geojsonData);
				} else {
						// Add a new source with the GeoJSON data
						map.addSource('geojsonData', {
								type: 'geojson',
								data: geojsonData
						});

						// Add a layer to display the points (icon)
						map.addLayer({
								id: 'geojsonLayer',
								type: 'symbol',
								source: 'geojsonData',
								layout: {
										'icon-image': 'fire',  // reference the image loaded
										'icon-size': 0.25
								}
						});

						// Add a heatmap layer using brightness
						map.addLayer({
								id: 'heatmapLayer',
								type: 'heatmap',
								source: 'geojsonData',
								maxzoom: 22,
								paint: {
										// Increase the heatmap weight based on brightness property
										'heatmap-weight': {
										property: 'point_count',
										type: 'identity',
										},
										// Increase the heatmap intensity as the zoom level increases
										'heatmap-intensity': [
												'interpolate',
												['linear'],
												['zoom'],
												0, 1,
												9, 22
										],
										// Color ramp for heatmap
										'heatmap-color': [
												'interpolate',
												['linear'],
												['heatmap-density'],
												0, 'rgba(21,25,18,0)',
												0.2, '#EF7532',
												0.4, '#EC9B00',
												0.6, '#EC5300',
												0.8, '#EE5E28',
												1, '#E94040'
										],
										// Adjust the heatmap radius by zoom level
										'heatmap-radius': [
												'interpolate',
												['linear'],
												['zoom'],
												0, 2,
												9, 22
										],
								}
						});
					//map.setLayoutProperty('heatmapLayer', 'visibility', 'none');
				}
		}

		// Automatically fetch and display data when the page loads
		async function initializeMap() {
				const data = await fetchData();
				if (data) {
						const geojsonData = dfToGeoJSON(data);

						// Add the markers as a GeoJSON layer and a heatmap layer
						addGeoJSONLayerToMap(geojsonData);
				} else {
						alert("Failed to fetch data from the API.");
				}
		}

		function handleClick(e) {
			const clickedDistrictId = e.features[0].id; // ID of the clicked district

			// If there is a previously selected district, reset its state
			if ($selectedDistrictId !== null) {
					map.setFeatureState(
							{ source: 'distritos', id: $selectedDistrictId },
							{ selected: false }
					);
			}

			// Select the new clicked district
			$selectedDistrictId = clickedDistrictId;
			map.setFeatureState(
					{ source: 'distritos', id: clickedDistrictId },
					{ selected: true }
			);

			// Get the bounding box of the clicked district
			let my_bbox = bbox(e.features[0]);
			// Fit the map to the bounding box of the clicked district
			map.fitBounds(my_bbox, {
					linear: false,
					maxZoom: 7,
					padding: {bottom: 250}
			});
		}

		map.on('load', () => {
				// Load an image from an external URL for the fire icon
				map.loadImage(
						'https://www.gstatic.com/devrel-devsite/prod/vdf5af65c45d9e2fdd493c581ff01cb1d11a21b4420a9fcc957400a26863da9d2/firebase/images/touchicon-180.png',
						(error, image) => {
								if (error) throw error;

								// Add the image to the map style
								map.addImage('fire', image);

								// Initialize the map and load the data
								initializeMap();
						}
				);

				fetch('short.geojson')
				.then(response => response.json())
				.then(data => {
					map.addSource('distritos', {
						'type': 'geojson',
						'data': data
					});
	
					map.addLayer({
						'id': 'distritos-fill',
						'type': 'fill',
						'source': 'distritos',
						'layout': {},
						'paint': {
							'fill-color': '#EE5E28',
							'fill-opacity': [
								'case',
								['boolean', ['feature-state', 'selected'], false],
								0.3,  // Color del distrito seleccionado
								0.1   // Color por defecto
							]
						}
					});
	
					map.addLayer({
						'id': 'distritos-line',
						'type': 'line',
						'source': 'distritos',
						'layout': {},
						'paint': {
							'line-color': '#EE5E28',
							'line-width': 1,
							'line-opacity': 0.75
						}
					});

					map.on('click', 'distritos-fill', handleClick);
	
					// Cambiar el cursor al pasar sobre un distrito
					map.on('mouseenter', 'distritos-fill', () => {
						map.getCanvas().style.cursor = 'pointer';
					});
	
					map.on('mouseleave', 'distritos-fill', () => {
						map.getCanvas().style.cursor = '';
					});
				})
				.catch(error => console.error('Error al cargar el GeoJSON:', error));
		});
		updateMapLayers();
	})

</script>

<main>
	<Search/>
	<div id="map"></div>
	<div class="container fcol g16">
		<button type="button" title="Capas" class="layers p12" on:click={() => {
			dialog.showModal();
			opened = true;
		}}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16.02 12 5.48 3.13a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74L7.98 12"/><path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74Z"/></svg>
		</button>
		<a href="/about" class="about p12">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-help"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
		</a>
		<article class="fcol px24 py32 g16">
			<slot/>
		</article>
	</div>
	<dialog bind:this={dialog} class="fcol g24" class:opened>
		<form class="fc between" method="dialog">
			<h1>Capas</h1>
			<button class="p8" type="submit" on:click={() => opened = false}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
			</button>
		</form>
		<div class="fcol g16">
			<label for="icons" class="fc g12">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
				<p class="grow">Iconos</p>
				<input class="toggle" type="checkbox" name="icons" id="icons" bind:checked={showIcons} on:change={toggleIcons}>
			</label>
			<label for="heatmap" class="fc g12">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
				<p class="grow">Mapa de Calor</p>
				<input class="toggle" type="checkbox" name="heatmap" id="heatmap" bind:checked={showHeatmap} on:change={toggleHeatmap}>
			</label>
		</div>
	</dialog>
</main>

<style>
	main {
		position: relative;
		overflow-x: hidden;
	}
	.container {
		position: absolute;
		align-items: flex-end;
		left: 16px;
		right: 16px;
		bottom: 16px;
	}
	button, .about, article, dialog {
		background: var(--bg);
	}
	button, .about {
		border-radius: 12px;
	}
	.layers, .about {
		position: absolute;
	}
	.layers {
		top: -60px;
	}
	.about {
		top: -120px;
	}
	button:hover, .about:hover {
		background: #232422;
	}
	article {
		border-radius: 1em;
		width: 100%;
		max-height: 50vh;
    overflow-y: scroll;
		-ms-overflow-style: none;
  	scrollbar-width: none;
	}
	article::-webkit-scrollbar {
		display: none;
	}
	#map {
		background: #1F1F20;
		width: 100vw;
		height: 100dvh;
	}
	dialog {
		left: auto;
		width: 80%;
		max-width: 360px;
		border: none;
		color: var(--text);
		bottom: 0;
    position: absolute;
    right: -100%;
    top: 0;
    margin: 0;
    height: 100%;
		max-height: unset;
    transition: all .5s;
    z-index: 6;
	}
	dialog.opened {
		right: 0;
	}
	h1 {
		font-size: 32px;
	}
	label p {
		user-select: none;
	}
	dialog::backdrop {
		backdrop-filter: blur(4px);
	}
</style>