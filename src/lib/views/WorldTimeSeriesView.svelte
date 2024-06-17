<script lang="ts">
	import { onMount } from 'svelte';
	import TimeSeriesChart from '$lib/charts/TimeSeriesChart.svelte';
	import {
		filterWeeklyDataByAll,
		loadHistoricalCovidData
	} from '$lib/services/historical-data-service';
	import type { HistoricalWhoRegionModel } from '$lib/models/historical-who-region-model';
	import { whoWorld } from '$lib/services/who-regions-service';

	let historialWorld: HistoricalWhoRegionModel | null = null;

	onMount(async () => {
		let covidData = await loadHistoricalCovidData();
		historialWorld = filterWeeklyDataByAll(covidData, whoWorld);
	});
</script>

{#if historialWorld}
<div class="flex gap-0 mt-2 p-2 justify-center relative">
	<div class="flex flex-col justify-center" style="width: 170px">
		<div class="text-1xl font-bold">{whoWorld.name}</div>
		<div class="text-3xl">{historialWorld.final.newCases.toLocaleString()}</div>
		<div class="text-1xl">last 7 days</div>
	</div>

	<TimeSeriesChart data={historialWorld.data} color={historialWorld.region.color} />
</div>
{/if}
