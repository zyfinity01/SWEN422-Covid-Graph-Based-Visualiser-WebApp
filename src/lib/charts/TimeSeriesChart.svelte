<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { HistoricalCountryCovidModel } from '$lib/models/historical-covid-model';

	export let data: HistoricalCountryCovidModel[];
	export let color: string;

	let svgElement: SVGSVGElement;
	let tooltip: HTMLDivElement;

	onMount(() => {
		const svg = d3.select(svgElement);

		const margin = { top: 20, right: 30, bottom: 30, left: 40 };
		const width = 600 - margin.left - margin.right;
		const height = 200 - margin.top - margin.bottom;
		const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleTime()
			.domain(d3.extent(data, (d) => d.dateReported) as [Date, Date])
			.range([0, width]);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.newCases)] as [number, number])
			.nice()
			.range([height, 0]);

		g.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x));

		g.append('g')
			.attr('class', 'axis axis--y')
			.call(d3.axisLeft(y).tickFormat(d3.format('.2s'))) // Use ".2s" to format with SI prefix and two significant digits
			.append('text')
			.attr('fill', '#000')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '0.71em')
			.attr('text-anchor', 'end')
			.text('New Cases');

		const line = d3
			.line<HistoricalCountryCovidModel>()
			.x((d) => x(d.dateReported))
			.y((d) => y(d.newCases));

		g.append('path')
			.datum(data)
			.attr('class', 'line')
			.attr('fill', 'none')
			.attr('stroke', color)
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line);

		// Add circles to each data point
		g.selectAll('.dot')
			.data(data)
			.enter().append('circle')
			.attr('class', 'dot')
			.attr('cx', d => x(d.dateReported))
			.attr('cy', d => y(d.newCases))
			.attr('r', 3)
			.attr('fill', color)
			.on('mouseover', (event, d) => {
				const [x, y] = d3.pointer(event);
				tooltip.style.left = `${x + 180}px`;
				tooltip.style.top = `${y + 10}px`;
				tooltip.style.display = 'inline-block';
				tooltip.innerHTML = `New Cases: ${d.newCases.toLocaleString()}`;
			})
			.on('mouseout', () => {
				tooltip.style.display = 'none';
			});
	});
</script>

<svg bind:this={svgElement} viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet"></svg>
<div bind:this={tooltip} class="tooltip" style="display: none;"></div>

<style lang="postcss">
	.axis--x path {
		display: none;
	}

	.line {
		fill: none;
		stroke-width: 2px;
	}

	.dot {
		cursor: pointer;
	}

	.tooltip {
		position: absolute;
		background: white;
		border: 1px solid #ccc;
		padding: 10px;
		border-radius: 3px;
		pointer-events: none;
		font-size: 16px;
	}
</style>
