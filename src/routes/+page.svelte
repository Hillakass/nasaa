<script>
	import Welcome from '$lib/comp/Welcome.svelte'
	import Map from '$lib/comp/Map.svelte'
	import { nombre } from '$lib/store.js'

	export let data

	const region = {
		name: 'AMAZONAS'
	}

	let datos = ['Cerro Colorado', 'Yura', 'Jose Luis Bustamante y Ribero', 'Cerro Colorado', 'Cayma',];
	let mostrarTodos = false;

	// Función para alternar entre mostrar más o menos
	function toggleMostrar() {
			mostrarTodos = !mostrarTodos;
	}

	// Obtener los datos que se mostrarán
	$: datosMostrados = mostrarTodos ? datos : datos.slice(0, 3);

	const animals = data.animals

	$: my_animals = animals.filter(r => r.name === region.name)[0].animals
</script>

<svelte:head>
	<title>GeoAlert</title>
</svelte:head>

{#if $nombre === ''}
	<Welcome />
{:else}
	<Map>
		{#if region}
			<h1>{region.name}</h1>
			<section class="fcol g12">
				<h2>Desastres en esta zona</h2>
				<div class="fcol g8">
					{#each datosMostrados as dato}
						<button type="button" class="disaster fc g12">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8.5 14.5C9.16304 14.5 9.79893 14.2366 10.2678 13.7678C10.7366 13.2989 11 12.663 11 12C11 10.62 10.5 10 10 9C8.928 6.857 9.776 4.946 12 3C12.5 5.5 14 7.9 16 9.5C18 11.1 19 13 19 15C19 15.9193 18.8189 16.8295 18.4672 17.6788C18.1154 18.5281 17.5998 19.2997 16.9497 19.9497C16.2997 20.5998 15.5281 21.1154 14.6788 21.4672C13.8295 21.8189 12.9193 22 12 22C11.0807 22 10.1705 21.8189 9.32122 21.4672C8.47194 21.1154 7.70026 20.5998 7.05025 19.9497C6.40024 19.2997 5.88463 18.5281 5.53284 17.6788C5.18106 16.8295 5 15.9193 5 15C5 13.847 5.433 12.706 6 12C6 12.663 6.26339 13.2989 6.73223 13.7678C7.20107 14.2366 7.83696 14.5 8.5 14.5Z" stroke="#EE5E28" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
							<p class="grow">{dato}</p>
							<p class="distance" class:red={true} class:yellow={false} class:green={false}>700 M</p>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>						
						</button>
					{/each}
				</div>
				<button type="button" class="more" on:click={toggleMostrar}>
					{mostrarTodos ? 'Mostrar menos' : 'Mostrar más'}
				</button>
			</section>
			<section class="fcol g12">
				<h2>Especies Endémicas</h2>
				<div class="fc g12 slider">
					{#each my_animals as animal}
						<img width="96" height="96" src={animal.img} alt={animal.name}>
					{/each}
				</div>
			</section>
			<section class="fcol g12">
				<h2>Averigua más</h2>
				<p>El Indice de Desarrollo Humano en Arequipa es el más bajo del país según el último censo de 	<a href="/">INEI 2024</a>.</p>
			</section>
			<button type="button" class="btn btn-outline">Recibir Notificaciones </button>
			<button type="button" class="btn btn-primary">Notificar Emergencia</button>
		{:else}
			<h1>Bienvenido a Geo<span>Alert</span></h1>
			<p>Seleccione una zona para empezar</p>
		{/if}
	</Map>
{/if}

<style>
	span {
		color: var(--orange);
	}
	h1 {
		font-size: 32px;
	}
	h2 {
		font-size: 24px;
	}
	.disaster, .more {
		color: var(--gray);
	}
	.disaster p {
		text-align: start;
	}
	.distance, .more  {
		font-weight: 700;
	}
	.red { color: var(--red) }
	.yellow { color: var(--yellow) }
	.green { color: var(--green) }

	.slider {
		overflow-x: scroll;
		-ms-overflow-style: none;
  	scrollbar-width: none;
	}
	.slider::-webkit-scrollbar {
		display: none;
	}
	img {
		border-radius: 1em;
		width: 96px;
		height: 96px;
	}
	section a {
		color: var(--white);
		font-weight: 600;
		text-decoration: none;
	}
</style>