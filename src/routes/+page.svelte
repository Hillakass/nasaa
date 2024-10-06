<script>
    import Nombre from '$lib/comp/nombre.svelte'; // Importa el componente Nombre (perfil)
    import Mapa from '$lib/comp/mapa.svelte';    // Importa el componente Mapa
    import { nombre } from '$lib/store.js';      // Importa el store para manejar el nombre

    let mostrarMapa = false;  // Controla si se muestra el mapa o el perfil
    let name = '';

    // Suscripción al store para obtener el valor guardado del nombre
    $: name = $nombre;

    function handleContinue() {
        if (name) {
            nombre.set(name);   // Guarda el nombre en el store
            mostrarMapa = true; // Cambia el estado para mostrar el mapa
        } else {
            alert('Por favor, ingresa tu nombre.');
        }
    }
</script>

<!-- Mostrar el componente Nombre o el Mapa dependiendo del estado -->
{#if mostrarMapa}
    <Mapa /> <!-- Renderiza el componente Mapa si se presiona "Continuar" -->
{:else}
    <Nombre on:continuar={handleContinue} /> <!-- Renderiza Nombre al principio -->
{/if}
