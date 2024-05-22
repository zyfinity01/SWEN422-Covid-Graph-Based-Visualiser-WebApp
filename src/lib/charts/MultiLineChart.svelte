<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let width: number = 800;
	export let height: number = 500;

	let svgElement: SVGSVGElement;
	let tooltip: HTMLDivElement;
	let data: { date: Date; deaths: number; country: string }[];

	// Set dimensions and margins of the graph
	const margin = { top: 10, right: 30, bottom: 70, left: 60 },
		canvasWidth = width - margin.left - margin.right,
		canvasHeight = height - margin.top - margin.bottom;

	onMount(async () => {
		const csvData = await d3.csv('data/who-covid-historical.csv');

		// Process and prepare data as before
		data = csvData.map((d) => ({
			date: d3.timeParse('%Y-%m-%d')(d.Date_reported),
			deaths: +d.New_deaths || 0,
			country: d.Country
		})) as { date: Date; deaths: number; country: string }[];

		draw();
	});

	const draw = () => {
		const deathsByMonthCountry = d3
			.rollups(
				data,
				(v) => d3.sum(v, (d) => d.deaths),
				(d) => `${d.date.getFullYear()}-${d.date.getMonth() + 1}`, // Year-month key
				(d) => d.country // Group by country
			)
			.map(([month, countries]) => ({
				month,
				countries: countries.map(([country, deaths]) => ({ country, deaths }))
			}));

		const svg = d3
			.select(svgElement)
			//.attr('width', canvasWidth + margin.left + margin.right)
			//.attr('height', canvasHeight + margin.top + margin.bottom)
			.attr('viewBox', '0 -20 700 390') // responsive resize
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand()
			.range([0, canvasWidth])
			.domain(deathsByMonthCountry.map((d) => d.month))
			.padding(0.2);

		svg
			.append('g')
			.attr('transform', `translate(0,${canvasHeight})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.attr('transform', 'translate(-10,0)rotate(-45)')
			.style('text-anchor', 'end');

		const y = d3.scaleLinear().domain([0, 140000]).range([canvasHeight, 0]).nice();

		svg.append('g').call(d3.axisLeft(y));

		// Add the X-axis label
		svg
			.append('text')
			.attr(
				'transform',
				'translate(' + canvasWidth / 2 + ' ,' + (canvasHeight + margin.top + 50) + ')'
			)
			.style('text-anchor', 'middle')
			.text('Date');

		// Add the Y-axis label
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 0 - margin.left)
			.attr('x', 0 - canvasHeight / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('Deaths');

		// Add Chart Title
		svg
			.append('text')
			.attr('x', canvasWidth / 2)
			.attr('y', 1)
			.attr('text-anchor', 'middle')
			.style('font-size', '16px')
			.style('text-decoration', 'underline')
			.text('Deaths by Country over Time');

		const color = d3.scaleOrdinal(d3.schemeTableau10);

		const monthGroups = svg
			.selectAll('.month-group')
			.data(deathsByMonthCountry)
			.enter()
			.append('g')
			.attr('transform', (d) => `translate(${x(d.month)}, 0)`);

		monthGroups
			.selectAll('rect')
			.data((d) => d.countries)
			.enter()
			.append('rect')
			.attr('x', 0)
			.attr('y', (d) => y(d.deaths))
			.attr('width', x.bandwidth())
			.attr('height', (d) => canvasHeight - y(d.deaths))
			.attr('fill', (d) => color(d.country))
			.on('mouseover', (event, d) => {
				tooltip.innerHTML = `Country: ${d.country}<br>Deaths: ${d.deaths}`;
				tooltip.classList.remove('invisible');
				tooltip.style.left = `${event.pageX + 10}px`;
				tooltip.style.top = `${event.pageY + 10}px`;
			})
			.on('mousemove', (event) => {
				tooltip.style.left = `${event.pageX + 10}px`;
				tooltip.style.top = `${event.pageY + 10}px`;
			})
			.on('mouseout', () => {
				tooltip.classList.add('invisible');
			});
	};
</script>

<!-- Canvas -->
<svg bind:this={svgElement} width="100%" />

<!-- Tooltip-->
<div
	bind:this={tooltip}
	class="absolute invisible bg-white border border-gray-300 p-1 rounded-md pointer-events-none"
></div>
