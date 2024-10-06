<script>
	import { nombre } from '$lib/store.js';
	let name = ''
</script>

<main class="fcol p16 fc g64">
	<div class="fcol fc g12">
		<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v3"/><path stroke="var(--orange)" d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
		<h1>Geo<span>Alert</span></h1>
	</div>
	<p><strong>Geo<span>Alert</span></strong> te conecta con tu <strong>comunidad</strong> para alertar sobre incendios y otros desastres. Recibe avisos en tiempo real y reporta eventos cerca tuyo.</p>
	<div class="fcol g48">
		<label>
			<input type="text" bind:value={name} placeholder="¿Cómo te llamas?" required />
		</label>
		<button type="button" class="btn btn-primary" on:click={() => $nombre = name}>
			Continuar
		</button>
	</div>
</main>

<style>
	main {
		max-width: 40ch;
		width: 100%;
		margin: auto;
		font-size: 20px;
		text-align: center;
		min-height: 100vh;
		justify-content: center;
	}
	h1 {
		font-size: 48px;
	}
	span {
		color: var(--orange);
	}
	input {
		background: transparent; 
		border: none;
		border-bottom: 2px solid var(--gray); 
		color: white;
		padding: 0.5rem 0;
		width: 100%;
		text-align: center; 
	}

	input:focus {
		outline: none;
		border-bottom: 2px solid var(--orange); 
	}

	input::placeholder {
		text-align: center; 
	}
</style>