<script>
    import { nombre } from '$lib/store.js';
</script>

<div class="map-container">
    <h2>Bienvenido al mapa, {$nombre}!</h2>
    <p>Aquí podrás ver el mapa con información relevante.</p>
</div>

<style>
    .map-container {
        text-align: center;
        padding: 2rem;
    }
</style>
