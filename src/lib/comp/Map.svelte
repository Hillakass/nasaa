<script>
	import mapboxgl from 'mapbox-gl'
	import Search from '$lib/comp/Search.svelte'
	import { onMount } from 'svelte';
	import { bbox } from '@turf/turf';
	import { selectedDistrictId } from '$lib/store.js'

	let dialog
	let opened = false

	onMount(() => {

		// Mapbox access token
		mapboxgl.accessToken = 'pk.eyJ1IjoicC1wYXNjYWwiLCJhIjoiY20wcHBsbWNpMDNqZzJpb2RvY2o4Y3lieSJ9.qXJ0kOaYERtJ22_Gzd7s-g';

		// Initialize the map
		const map = new mapboxgl.Map({
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
	})

</script>

<main>
	<Search/>
	<div id="map"></div>
	<div class="container fcol g16">
		<button type="button" title="Capas" class="p12" on:click={() => {
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
			<label for="disasters" class="fc g12">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trees"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/></svg>
				<p class="grow">Desastres Naturales</p>
				<input class="toggle" type="checkbox" name="disasters" id="disasters">
			</label>
			<label for="disasters" class="fc g12">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
				<p class="grow">Seguridad</p>
				<input class="toggle" type="checkbox" name="disasters" id="disasters">
			</label>
			<label for="disasters" class="fc g12">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
				<p class="grow">Población</p>
				<input class="toggle" type="checkbox" name="disasters" id="disasters">
			</label>
			<label for="disasters" class="fc g12">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
				<p class="grow">Nivel Económico</p>
				<input class="toggle" type="checkbox" name="disasters" id="disasters">
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
		top: -64px;
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
		width: 80%;
		max-width: 360px;
		border: none;
		color: var(--text);
		bottom: 0;
    left: 100%;
    top: 0;
    margin: 0;
    height: 100%;
		max-height: unset;
    transition: all .5s;
    z-index: 6;
	}
	dialog.opened {
		left: 20%;
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
