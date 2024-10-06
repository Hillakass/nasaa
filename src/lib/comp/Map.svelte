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
	button, article {
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
</style>
