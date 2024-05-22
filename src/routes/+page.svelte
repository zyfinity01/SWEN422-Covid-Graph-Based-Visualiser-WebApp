<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	import MultiLineChart from '$lib/charts/MultiLineChart.svelte';
	import InteractiveMap from '$lib/charts/InteractiveMap.svelte';
	import TimeSeriesView from '$lib/views/TimeSeriesView.svelte';
</script>

<Header title="Covid-19 World Visualizations" />

<div class="grid grid-cols-1 sm:grid-cols-5 gap-5 m-5 md:mx-10">
	<div class="col-span-3 space-y-5">
		<!-- World Map-->
		<div class="card">
			<InteractiveMap />
		</div>

		<!-- Multi Line Chart-->
		<div class="card">
			<MultiLineChart width={700} height={350} />
		</div>
	</div>

	<div class="col-span-2 space-y-5">
		<!-- Continent Stats -->
		<div class="card">
			<TimeSeriesView />
		</div>
	</div>
</div>

<style lang="postcss">
	.card {
		@apply p-5 bg-slate-100 rounded-xl;
	}
</style>
