<script lang="ts">
	import { csv } from 'd3-fetch';
	import {
		type InternMap,
		ascending,
		bisector,
		descending,
		group,
		pairs,
		range,
		rollup
	} from 'd3-array';
	import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
	import { schemeSet3 } from 'd3-scale-chromatic';
	import { timeFormat } from 'd3-time-format';
	import { onMount } from 'svelte';

	interface Record {
		date: Date;
		name: string;
		value: number;
	}

	interface KeyframeRecord {
		name: string;
		rank?: number;
		value: number;
	}

	export let datasetUrl: string;
	export let maxBars: number;

	const barSize = 48;
	const duration = 150;

	let ticker = '';
	let keyframeItems: any[] = [];

	const formatTicker = timeFormat('%b %Y');

	const dimensions = {
		width: 840,
		height: 420,
		margin: {
			top: 24,
			right: 0,
			bottom: 0,
			left: 0
		}
	};

	const xScale = scaleLinear(
		[0, 1],
		[dimensions.margin.left, dimensions.width - dimensions.margin.right]
	);

	const yScale = scaleBand<number>()
		.domain(range(6 + 1))
		.rangeRound([dimensions.margin.top, dimensions.margin.top + barSize * (maxBars + 1 + 0.1)])
		.padding(0.1);

	let colorScale = (_d: KeyframeRecord) => '#FF0000';

	onMount(async () => {
		const data = await csv(datasetUrl, ({ Country, Date_reported, Cumulative_cases }) => ({
			date: new Date(Date_reported),
			name: Country,
			value: +Cumulative_cases
		}));

		const grouping = group(data, (d) => d.name);
		const names = new Set(data.map(({ name }) => name));
		const dateValues = Array.from(
			rollup(
				data,
				([d]) => d.value,
				(d) => +d.date,
				(d) => d.name
			)
		)
			.map(([date, data]) => [new Date(date), data])
			.sort((a: (Date | InternMap<string, number>)[], b: (Date | InternMap<string, number>)[]) => {
				return ascending(a[0] as Date, b[0] as Date);
			});

		const interpolateValue = (data: Record[], date: Date) => {
			const bisectDate = bisector((d: Record) => d.date).left;
			const i = bisectDate(data, date);

			if (i === 0) {
				return data[0].value;
			}

			if (i === data.length) {
				return data[data.length - 1].value;
			}

			const d0 = data[i - 1];
			const d1 = data[i];
			const t = (date.valueOf() - d0.date.valueOf()) / (d1.date.valueOf() - d0.date.valueOf());

			return Math.floor(d0.value + t * (d1.value - d0.value));
		};

		const rank = (value: (name: string) => number) => {
			const data: KeyframeRecord[] = Array.from(names, (name) => ({
				name,
				value: value(name)
			}));

			data.sort((a, b) => descending(a.value, b.value));

			for (let i = 0, len = data.length; i < len; ++i) {
				data[i].rank = Math.min(maxBars, i);
			}

			return data;
		};

		const keyframes: [Date, any][] = [];
		let ka: Date,
			a: InternMap<string, number>,
			kb: Date,
			b: InternMap<string, number>,
			kfDate: Date;

		for ([[ka, a], [kb, b]] of pairs(dateValues as [Date, InternMap<string, number>][])) {
			keyframes.push([
				(kfDate = new Date(ka)),
				rank(
					(name: string) => a.get(name) || interpolateValue(grouping.get(name) as Record[], kfDate)
				)
			]);

			for (let i = 1; i < 10; ++i) {
				const t = i / 10;

				keyframes.push([
					(kfDate = new Date(ka.valueOf() * (1 - t) + kb.valueOf() * t)),
					rank((name: string) => interpolateValue(grouping.get(name) as Record[], kfDate))
				]);
			}
		}

		keyframes.push([
			// @ts-ignore
			(kfDate = new Date(kb)),
			rank(
				(name: string) => b.get(name) || interpolateValue(grouping.get(name) as Record[], kfDate)
			)
		]);

		colorScale = (d) => {
			const scale = scaleOrdinal(schemeSet3).domain(Array.from(names));

			return scale(d.name);
		};

		let current = 0,
			totalKeyframes = keyframes.length;

		const intervalId = setInterval(() => {
			if (current >= totalKeyframes) {
				clearInterval(intervalId);
				return;
			}

			ticker = formatTicker(keyframes[current][0]);
			keyframeItems = keyframes[current++][1];

			xScale.domain([0, keyframeItems[0].value]);
		}, duration);
	});

	function barExit(_node: Element) {
		return {
			duration: duration * 2,
			css: (t: number) => {
				return `                                         
            opacity: ${t};
          `;
			}
		};
	}

	function barEnter(_node: Element) {
		return {
			duration: duration * 2,
			css: (t: number) => {
				return `
            opacity: ${t};                                     
          `;
			}
		};
	}
</script>

<svg width="100%" height="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
	<g fill-opacity="0.6">
		{#each keyframeItems.slice(0, maxBars) as item, i (item.name)}
			{#if item.value > 0}
				<g in:barEnter out:barExit>
					<rect
						fill={colorScale(item)}
						height={yScale.bandwidth()}
						x={xScale(0)}
						style={`transition: width ${duration / 1000}s linear, transform ${
							duration / 1000
						}s linear; width: ${
							xScale(item.value) - xScale(0)
						}px; transform: translateY(${yScale(item.rank)}px);`}
					/>
					<text
						text-anchor="end"
						font-weight="bold"
						font-size="12"
						y={yScale.bandwidth() / 2}
						x="-6"
						dy="-0.25em"
						style={`transition: transform ${duration / 1000}s linear; transform: translate3d(${
							xScale(item.value) - xScale(0)
						}px, ${yScale(item.rank)}px, 0);`}
					>
						{item.name}
						<tspan fill-opacity="0.7" font-weight="normal" x="-6" dy="1.15em"> {item.value}</tspan>
					</text>
				</g>
			{/if}
		{/each}
	</g>
	<g transform={`translate(0 ${dimensions.margin.top})`} fill="none">
		<g class="tick" opacity="1"
			><line stroke="currentColor" y2={barSize * (maxBars + yScale.padding()) + 100} /></g
		>
	</g>
	{#if ticker}
		<text
			y={dimensions.margin.top + barSize * (maxBars - 0.45)}
			x={dimensions.width - 6}
			text-anchor="end"
			font-weight="bold"
			font-size={`${barSize}px`}
			dy="0.32em">{ticker}</text
		>
	{/if}
</svg>
