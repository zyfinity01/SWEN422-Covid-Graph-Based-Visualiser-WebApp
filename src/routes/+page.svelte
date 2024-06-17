<script lang="ts">
	import MultiLineChart from '$lib/charts/MultiLineChart.svelte';
	import InteractiveMap from '$lib/charts/InteractiveMap.svelte';
	import WorldTimeSeriesView from '$lib/views/WorldTimeSeriesView.svelte';
	import RegionTimeSeriesView from '$lib/views/RegionSeriesView.svelte';
	import MultiStackedAreaChart from '$lib/charts/MultiStackedAreaChart.svelte';
	import BarChartRace from '$lib/charts/BarChartRace.svelte';
	import Navigation from '$lib/Navigation.svelte';
</script>

<Navigation page="Home" />

<div class="grid grid-cols-1 lg:grid-cols-5 gap-5 p-5 lg:px-10">
	<div class="lg:col-span-3 space-y-5">
		<!-- World Map -->
		<div class="card">
			<div class="text-center text-2xl text-slate-900">World Map</div>
			<div class="text-center text-lg text-slate-500">Hover over regions to see statistics</div>
			<InteractiveMap />
		</div>

		<!-- Stacked Area Chart -->
		<div class="card">
			<div class="text-center text-2xl text-slate-900">Comparison Between Cases and Vaccinated</div>
			<div class="text-center text-lg text-slate-500">Hover over to see exact figures</div>
			<MultiStackedAreaChart />
		</div>

		<!-- Multi Line Chart -->
		<div class="card">
			<div class="text-center text-2xl text-slate-900">Deaths by Country over Time</div>
			<div class="text-center text-lg text-slate-500">Hover over bars to see country</div>
			<MultiLineChart width={700} height={350} />
		</div>
	</div>

	<div class="lg:col-span-2 space-y-5">
		<!-- World Stats -->
		<div class="card">
			<div class="text-center text-2xl text-slate-900">Weekly reported cases for total world</div>
			<WorldTimeSeriesView />
		</div>

		<!-- Continent Stats -->
		<div class="card">
			<div class="text-center text-2xl text-slate-900">Weekly reported cases by WHO region</div>
			<RegionTimeSeriesView />
		</div>

		<!-- Bar Chart Race -->
		<div class="card">
			<div class="text-center text-2xl text-slate-900">Cumulative cases by Country over Time</div>
			<div class="text-center text-lg text-slate-500">From the start of the pandemic to now</div>
			<BarChartRace datasetUrl={'data/who-covid-historical.csv'} maxBars={7} />
		</div>
	</div>
</div>

<div class="bg-gray-100 h-16 text-slate-500 flex justify-center items-center break-all">
	<svg height="24" viewBox="0 0 48 48" width="24" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 0h48v48h-48z" fill="none" />
		<path
			d="M22 34h4v-12h-4v12zm2-30c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16zm-2-22h4v-4h-4v4z"
			fill="currentColor"
		/>
	</svg>

	<p class="underline">
		<a href="sources">Data sourced from the World Health Organisation and Our World in Data.</a>
	</p>
</div>

<style lang="postcss">
	.card {
		@apply p-5 bg-white rounded-xl;
	}
</style>
