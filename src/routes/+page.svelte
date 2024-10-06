<script>
    import Welcome from '$lib/comp/Welcome.svelte'; // Importa el componente Nombre (perfil)
    import Map from '$lib/comp/Map.svelte';    // Importa el componente Mapa
    import { nombre } from '$lib/store.js';      // Importa el store para manejar el nombre
</script>

<!-- {#if $nombre === ''} -->
    <Welcome />
<!-- {:else}
    <Map />
{/if} -->