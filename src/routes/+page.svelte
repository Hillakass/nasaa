<script>
	import Welcome from '$lib/comp/Welcome.svelte'
	import Map from '$lib/comp/Map.svelte'

	import { nombre } from '$lib/store.js'
</script>

{#if $nombre === ''}
	<Welcome />
{:else}
	<Map>
		<h1>Bienvenido a Geo<span>Alert</span></h1>
		<p>Seleccione una zona para empezar</p>
	</Map>
{/if}

<style>
	span {
		color: var(--orange);
	}
</style>