
<header class="p16">
	<a href="/" class="fc g8">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v3"/><path stroke="var(--orange)" d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
		<h1>Geo<span>Alert</span></h1>
	</a>
</header>
<main class="fcol p16 g16">
	<h1>Sobre el proyecto</h1>
	<h2>Nosotros</h2>
	<p>Somos un grupo multidisciplinar interesado por la investigación y la ciencia, participantes del Hackaton 2024 NASA Space Apps Challenge Community Mapping.	</p>
	<p>GeoAlert es una aplicación web progresiva (PWA) que ayuda a sus usuarios a mantenerse alerta e informados sobre varios desastres naturales y sus consecuencias en el medio ambiente, contando con información actualizada en un lapso de 4 días, mostramos al usuario un mapa interactivo con mucha información relevante.</p>
	<h2>Sobre la aplicación</h2>
	<p>Para su desarrollo usamos Svelte, Mapbox como plataforma de mapeo/GIS, Netlify como plataforma de despliegue y los datos de Fire Information for Resources Management System de la NASA.	</p>
	<p>El aplicativo muestra un mapa interactivo del Perú donde se muestran incendios, puedes seleccionar un departamento para ver datos relevantes del mismo. Entre los que se encuentran los desastres en la zona, las especies endémicas en peligro y datos de la zona. 
	</p>
	<h2>Próximamente</h2>
	<p>GeoAlert está diseñado para poder en un futuro agregar más desastres naturales, agregar la opción de alertar de posibles desastres, recibir notificaciones y visualizar diferentes factores como seguridad, nivel económico y población en la región, un buscador para los departamentos, la distancia entre el usuario y el desastre más próximo.
	</p>
</main>

<style>
	header, main {
		max-width: 55ch;
		margin: auto;
	}
	h1 {
		color: white;
	}
	span {
		color: var(--orange);
	}
	header a {
		text-decoration: none;
		color: white;
	}
	header h1 {
		font-size: 1.5em;
	}
</style>