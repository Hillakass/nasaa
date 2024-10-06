<script>
    
    let name = '';
</script>

<div class="container center">
    <div class="center logo-container">
        <svg width="128" height="129" viewBox="0 0 128 129" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6667 53.8333V69.8333" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M32 32.5V91.1667" stroke="#EE5E28" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M53.3333 16.5V112.5" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M74.6667 43.1667V80.5" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M96 27.1667V96.5" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M117.333 53.8333V69.8333" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
    </div>
    <h1 class="title">Geo<span class="naranja">Alert</span></h1>
    <p class="descripcion">
        <span class="highlight">Geo</span><span class="naranja">Alert</span> te conecta con tu <span class="highlight">comunidad</span> para alertar sobre incendios y otros desastres. 
        Recibe avisos en tiempo real y reporta eventos cerca tuyo.
    </p>
    
    <div class="input-section">
        <label>
            <input type="text" bind:value={name} placeholder="¿Cómo te llamas?" required />
        </label>
        <button class="btn btn-primary" on:click={() => alert(`Hola, ${name}`)}>
            Continuar
        </button>
    </div>
</div>

