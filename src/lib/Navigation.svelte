<script lang="ts">
	export let page: string = 'Home';
</script>

<svelte:head>
	<title>{page} | Covid-19 World Visualisations</title>
</svelte:head>

<div class="w-full flex items-center px-3 shadow h-16 bg-white">
	<a href="/"><img src="favicon.png" alt="Covid-19" class="h-10 w-10" /></a>
	<a href="/"><h1 class="text-xl ml-2 font-semibold">Covid 19 Visualisations</h1></a>

	<div class="flex-grow"></div>
	<div class="flex items-center gap-3">
		<a href="/" class="mr-2" class:active={page == 'Home'}>Home</a>
		<a href="/sources" class="mr-2" class:active={page == 'Sources'}>Data Sources</a>
	</div>
</div>

<style lang="postcss">
	.active {
		@apply text-blue-500 font-bold;
	}
</style>
