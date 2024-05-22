<script lang="ts">
	import { onMount } from 'svelte';
	import TimeSeriesChart from '$lib/charts/TimeSeriesChart.svelte';
	import type { WhoRegionModel } from '$lib/models/who-region-model';
	import {
		filterWeeklyDataByRegion,
		getWhoRegionsFromData,
		loadHistoricalCovidData
	} from '$lib/services/historical-data-service';

	let whoRegions: WhoRegionModel[] = [];

	onMount(async () => {
		let covidData = await loadHistoricalCovidData();
		let regionNames = getWhoRegionsFromData(covidData);
		whoRegions = regionNames.map((x) => filterWeeklyDataByRegion(covidData, x));
	});
</script>

{#each whoRegions as whoRegion}
	<div class="flex gap-10 mb-10 p-10 justify-center">
		<div class="flex flex-col justify-center">
			<div class="text-2xl">{whoRegion.whoRegion}</div>
			<div class="text-3xl">{whoRegion.final.cumulativeCases.toLocaleString()}</div>
		</div>

		<TimeSeriesChart data={whoRegion.data} />
	</div>
{/each}
