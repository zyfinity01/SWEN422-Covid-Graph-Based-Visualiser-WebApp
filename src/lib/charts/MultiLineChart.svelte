<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let svgElement: SVGSVGElement;

	onMount(async () => {
		const data = await d3.csv('data/sales.csv');

		const svg = d3.select(svgElement);

		const margin = { top: 20, right: 20, bottom: 30, left: 40 };
		const width = +svg.attr('width') - margin.left - margin.right;
		const height = +svg.attr('height') - margin.top - margin.bottom;
		const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand()
			.rangeRound([0, width])
			.padding(0.1)
			.domain(data.map((d) => d.product));

		const y = d3
			.scaleLinear()
			.rangeRound([height, 0])
			// @ts-ignore
			.domain([0, d3.max(data, (d) => d.sales)]);

		g.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x));

		g.append('g')
			.attr('class', 'axis axis--y')
			.call(d3.axisLeft(y).ticks(10, 's'))
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '0.71em')
			.attr('text-anchor', 'end')
			.text('Sales');

		g.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			// @ts-ignore
			.attr('x', (d) => x(d.product))
			// @ts-ignore
			.attr('y', (d) => y(d.sales))
			// @ts-ignore
			.attr('width', x.bandwidth())
			// @ts-ignore
			.attr('height', (d) => height - y(d.sales));
	});
</script>

<svg bind:this={svgElement} width={300} height={300} />
