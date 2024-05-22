<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	import MultiLineChart from '$lib/charts/MultiLineChart.svelte';
	import InteractiveMap from '$lib/charts/InteractiveMap.svelte';
	import TimeSeriesView from '$lib/views/TimeSeriesView.svelte';
	import BarChartRace from '$lib/charts/BarChartRace.svelte';
</script>

<Header title="Covid-19 World Visualizations" />

<div class="grid grid-cols-1 md:grid-cols-5 gap-5 m-5 md:mx-10">
	<div class="col-span-3 space-y-5">
		<!-- World Map -->
		<div class="card">
			<div class="text-center text-2xl">World Map</div>
			<div class="text-center text-l text-slate-500">Hover over regions to see statistics</div>
			<InteractiveMap />
		</div>

		<!-- Multi Line Chart -->
		<div class="card">
			<div class="text-center text-2xl">Deaths by Country over Time</div>
			<div class="text-center text-l text-slate-500">Hover over bars to see country</div>
			<MultiLineChart width={700} height={350} />
		</div>

		<!-- Bar Chart Race -->
		<div class="card">
			<div class="text-center text-2xl">Cumulative cases by Country over Time</div>
			<div class="text-center text-l text-slate-500">From the start of the pandemic to now</div>
			<BarChartRace datasetUrl={'data/who-covid-historical.csv'} maxBars={7} />
		</div>
	</div>

	<div class="col-span-2 space-y-5">
		<!-- Continent Stats -->
		<div class="card">
			<div class="text-center text-2xl">Weekly reported cases by WHO region</div>
			<TimeSeriesView />
		</div>
	</div>
</div>

<style lang="postcss">
	.card {
		@apply p-5 bg-slate-100 rounded-xl;
	}
</style>
