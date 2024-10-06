<script>
	import Search from '$lib/comp/Search.svelte'
</script>

<main>
	<Search/>
	<div id="map"></div>
	<div class="container fcol g16">
		<button type="button" title="Capas" class="p12">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers-2"><path d="m16.02 12 5.48 3.13a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74L7.98 12"/><path d="M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74Z"/></svg>
		</button>
		<article class="fcol px24 py32 g16">
			<slot/>
		</article>
	</div>
	<dialog open>
		<div class="fc between">
			<h1>Capas</h1>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
		</div>
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
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
				<p class="grow">Nivel Socio-económico</p>
				<input class="toggle" type="checkbox" name="disasters" id="disasters">
			</label>
		</div>
	</dialog>
</main>

<style>
	main {
		position: relative;
	}
	.container {
		position: absolute;
		align-items: flex-end;
		left: 16px;
		right: 16px;
		bottom: 16px;
	}
	button, article, dialog {
		background: var(--bg);
	}
	button {
		border-radius: 12px;
	}
	button:hover {
		background: #232422;
	}
	article {
		border-radius: 1em;
		width: 100%;
	}
	#map {
		background: #1F1F20;
		width: 100vw;
		height: 100vh;
	}
	dialog {
		width: 80%;
		max-width: 360px;
		border: none;
		color: var(--text);
	}
	h1 {
		font-size: 32px;
	}
	label p {
		user-select: none;
	}
</style>
