<script lang="ts">
	import { onMount } from 'svelte';
	import { csv, json, geoNaturalEarth1, geoPath, scaleLinear, select } from 'd3';
	import type { GeoPermissibleObjects } from 'd3';
	import type { FeatureCollection, Geometry } from 'geojson';

	let svgElement: SVGSVGElement;
	let tooltipElement: HTMLDivElement;

	interface CountryData {
		iso_code: string;
		total_cases: string;
		total_deaths: string;
		location: string;
	}

	type GeoJson = FeatureCollection<Geometry, { iso_a3: string }>;

	function formatNumber(num: number) {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(2) + 'M'; // Millions
		} else if (num >= 1000) {
			return (num / 1000).toFixed(2) + 'K'; // Thousands
		} else {
			return num.toString(); // Less than 1000
		}
	}

	onMount(async () => {
		const covidData: CountryData[] = await csv('data/owid-covid-latest.csv');
		const worldData = await json<GeoJson>('data/custom.geo.json');

		if (!worldData) {
			console.error('Failed to load world data.');
			return;
		}

		const svg = select(svgElement).attr('viewBox', '0 0 950 500');
		const projection = geoNaturalEarth1().fitSize([960, 600], worldData as GeoPermissibleObjects);
		const pathGenerator = geoPath().projection(projection);

		const casesMax = Math.max(...covidData.map((d) => +d.total_cases));
		const colorScale = scaleLinear<string>().domain([0, casesMax]).range(['#ccc', '#b00']);

		svg
			.selectAll('path')
			.data(worldData.features)
			.enter()
			.append('path')
			.attr('d', pathGenerator)
			.attr('fill', (d) => {
				const countryData = covidData.find((cd) => cd.iso_code === d.properties.iso_a3);
				return countryData ? colorScale(+countryData.total_cases) : '#eee';
			})
			.on('mouseover', (event, d) => {
				const countryData = covidData.find((cd) => cd.iso_code === d.properties.iso_a3);
				tooltipElement.innerHTML = countryData
					? `${countryData.location}: ${formatNumber(Number(countryData.total_cases))} cases, ${formatNumber(Number(countryData.total_deaths))} deaths`
					: 'No data';

				tooltipElement.classList.remove('invisible');
				tooltipElement.style.left = `${event.pageX + 10}px`;
				tooltipElement.style.top = `${event.pageY + 10}px`;
			})
			.on('mousemove', (event) => {
				tooltipElement.style.left = `${event.pageX + 10}px`;
				tooltipElement.style.top = `${event.pageY + 10}px`;
			})
			.on('mouseout', () => {
				tooltipElement.classList.add('invisible');
			});
	});
</script>

<svg bind:this={svgElement} width="100%"></svg>
<div
	bind:this={tooltipElement}
	class="invisible"
	style="position: absolute; background-color: white; padding: 5px; border: 1px solid black;"
></div>
