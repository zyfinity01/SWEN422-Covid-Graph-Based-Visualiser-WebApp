<script lang="ts">
	import { onMount } from 'svelte';
	import { csv, json, geoNaturalEarth1, geoPath, scaleLinear, select } from 'd3';

	let svgElement: SVGSVGElement;
	let tooltipElement: HTMLDivElement;
	let attributeSelector: HTMLSelectElement;

	interface CountryData {
		iso_code: string;
		total_cases: string;
		total_deaths: string;
		total_cases_per_million: string;
		total_deaths_per_million: string;
		location: string;
	}

	type GeoJson = FeatureCollection<Geometry, { iso_a3: string }>;

	let covidData: CountryData[];
	let worldData: GeoJson;

	function formatNumber(num: number) {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(2) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(2) + 'K';
		} else {
			return num.toString();
		}
	}

	onMount(async () => {
		covidData = await csv('data/owid-covid-latest.csv');
		worldData = await json<GeoJson>('data/custom.geo.json');
		updateMap(); // Initial map setup
	});

	function updateMap() {
		const attribute = attributeSelector.value;
		const max = Math.max(...covidData.map((d) => +d[attribute]));
		const colorScale = scaleLinear<string>()
			.domain([0, max * 0.1, max])
			.range(['#ccc', '#b00']);

		select(svgElement).selectAll('path').remove(); // Clear existing paths to redraw

		const svg = select(svgElement).attr('viewBox', '0 0 950 500');
		const pathGenerator = geoPath().projection(geoNaturalEarth1().fitSize([960, 600], worldData));
		select(svgElement)
			.selectAll('path')
			.data(worldData.features)
			.enter()
			.append('path')
			.attr('d', pathGenerator)
			.attr('fill', (d) => {
				const countryData = covidData.find((cd) => cd.iso_code === d.properties.iso_a3);
				return countryData ? colorScale(+countryData[attribute]) : '#eee';
			})
			.on('mouseover', (event, d) => {
				const countryData = covidData.find((cd) => cd.iso_code === d.properties.iso_a3);
				if (countryData) {
					tooltipElement.innerHTML = `${countryData.location}: ${formatNumber(+countryData[attribute])} ${attribute.replace(/_/g, ' ')}`;
				} else {
					tooltipElement.innerHTML = 'No data';
				}
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

		const defs = svg.append('defs');
		const linearGradient = defs
			.append('linearGradient')
			.attr('id', 'gradient')
			.attr('x1', '0%')
			.attr('y1', '80%')
			.attr('x2', '0%')
			.attr('y2', '0%');
		linearGradient
			.selectAll('stop')
			.data(colorScale.range())
			.enter()
			.append('stop')
			.attr('offset', (d, i) => i / (colorScale.range().length - 1))
			.attr('stop-color', (d) => d);

		const legend = svg.append('g').attr('class', 'legend').attr('transform', 'translate(10, 150)');

		legend
			.append('rect')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('width', 20)
			.attr('height', 200)
			.style('fill', 'url(#gradient)');

		legend
			.append('text')
			.attr('class', 'legend-text')
			.attr('x', 30)
			.attr('y', 0)
			.attr('dy', '.35em')
			.text('High');

		legend
			.append('text')
			.attr('class', 'legend-text')
			.attr('x', 30)
			.attr('y', 200)
			.attr('dy', '.35em')
			.text('Low');
	}
</script>

<select bind:this={attributeSelector} on:change={updateMap} class="rounded-xl px-3 py-1">
	<option value="total_cases">Total Cases</option>
	<option value="total_deaths">Total Deaths</option>
	<option value="total_cases_per_million">Cases per million</option>
	<option value="total_deaths_per_million">Deaths per million</option>
	<!-- Add other options as needed -->
</select>

<svg bind:this={svgElement} width="100%"></svg>
<div
	bind:this={tooltipElement}
	class="invisible"
	style="position: absolute; background-color: white; padding: 5px; border: 1px solid black;"
></div>
