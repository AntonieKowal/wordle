<template>
	<div id="app">
		<Game />
	</div>
</template>

<script>
import Game from './components/Game.vue';

export default {
	name: 'App',
	components: {
		Game,
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	width: 80vw;
	height: 100vh;

	max-width: 540px;


}

body {
	display: flex;
	justify-content: center;
}

* {
	margin: 0;
	padding: 0;
}

@media only screen and (max-width: 600px) {
	#app {
		width: 95vw;
	}
}
</style>
