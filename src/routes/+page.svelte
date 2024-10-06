<script>
    import Nombre from '$lib/comp/nombre.svelte'; // Importa el componente Nombre (perfil)
    import Mapa from '$lib/comp/mapa.svelte';    // Importa el componente Mapa
    import { nombre } from '$lib/store.js';      // Importa el store para manejar el nombre
</script>

{#if $nombre === ''}
    <Nombre />
{:else}
    <Mapa />
{/if}