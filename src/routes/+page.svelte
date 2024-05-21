<script lang="ts">
	import MultiLineChart from '$lib/charts/MultiLineChart.svelte';
	import InteractiveMap from '$lib/charts/InteractiveMap.svelte';
</script>

<div class="w-full h-24 border-b-2 flex items-center justify-center">
	<h1 class="text-3xl">Covid 19 Visualizations</h1>
</div>

<div class="flex flex-col">
	<!-- <MultiLineChart /> -->
	<InteractiveMap />
</div>
