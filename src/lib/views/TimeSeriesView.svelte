<script lang="ts">
	import { onMount } from 'svelte';
	import TimeSeriesChart from '$lib/charts/TimeSeriesChart.svelte';
	import type { WhoRegionModel } from '$lib/models/who-region-model';
	import {
		filterWeeklyDataByRegion,
		loadHistoricalCovidData
	} from '$lib/services/historical-data-service';
	import type { HistoricalWhoRegionModel } from '$lib/models/historical-who-region-model';
	import { whoRegions } from '$lib/services/who-regions-service';

	let historicalRegions: HistoricalWhoRegionModel[] = [];

	onMount(async () => {
		let covidData = await loadHistoricalCovidData();
		historicalRegions = whoRegions.map(x => filterWeeklyDataByRegion(covidData, x));
	});
</script>

{#each historicalRegions as historicalRegion}
	<div class="flex gap-0 mt-2 p-2 justify-center">
		<div class="flex flex-col justify-center" style="width: 170px">
			<div class="text-1xl font-bold">{historicalRegion.region.name}</div>
			<div class="text-3xl">{historicalRegion.final.newCases.toLocaleString()}</div>
			<div class="text-1xl">last 7 days</div>
		</div>

		<TimeSeriesChart data={historicalRegion.data} color={historicalRegion.region.color} />
	</div>
{/each}
