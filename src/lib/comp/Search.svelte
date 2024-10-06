<form class="fc g8 px16 py12">
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v3"/><path stroke="var(--orange)" d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
	<input type="text" name="query" placeholder="Buscar zonas...">
	<button type="submit">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
	</button>
</form>

<style>
	form {
		background: var(--bg);
		border-radius: 24px;
		position: absolute;
		z-index: 4;

		left: 16px;
		right: 16px;
		top: 16px;
	}
	input {
		flex: 1;
		color: var(--white);
	}
	input:focus {
		outline: none;
	}
</style>