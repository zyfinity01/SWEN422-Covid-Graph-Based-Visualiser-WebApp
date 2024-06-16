<script lang="ts">
	import { csv } from 'd3-fetch';
	import { bisector, descending, group, pairs, range, rollup } from 'd3-array';
	import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
	import { schemeSet3 } from 'd3-scale-chromatic';
	import { timeFormat } from 'd3-time-format';
	import { onMount } from 'svelte';
	import type { InternMap } from 'd3';

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

	const dimensions = {
		width: 840,
		height: 420,
		margin: { top: 24, right: 0, bottom: 0, left: 0 }
	};

	const barSize = 48;
	const duration = 50;
	let ticker = '';
	let keyframeItems: KeyframeRecord[] = [];
	const formatTicker = timeFormat('%b %Y');

	const xScale = scaleLinear()
		.domain([0, 1])
		.range([dimensions.margin.left, dimensions.width - dimensions.margin.right]);
	const yScale = scaleBand<number>()
		.domain(range(0, 7))
		.rangeRound([dimensions.margin.top, dimensions.margin.top + barSize * (maxBars + 1.1)])
		.padding(0.1);

	let colorScale = scaleOrdinal(schemeSet3);
	let dateValues: [Date, InternMap<string, number>][] = [];
	let grouping: Map<string, Record[]> = new Map();
	let names: Set<string> = new Set();
	let interpolateValue: (data: Record[], date: Date) => number;
	let rank: (valueFn: (name: string) => number) => KeyframeRecord[];
	let keyframes: [Date, KeyframeRecord[]][] = [];

	let playing = false;
	let current: number;
	let intervalId: number;
	let currentDateIndex = 0;

	onMount(async () => {
		const data = await csv(datasetUrl, ({ Country, Date_reported, Cumulative_cases }) => ({
			date: new Date(Date_reported),
			name: Country,
			value: +Cumulative_cases
		}));

		grouping = group(data, (d) => d.name);
		names = new Set(data.map((d) => d.name));

		dateValues = Array.from(
			rollup(
				data,
				([d]) => d.value,
				(d) => +d.date,
				(d) => d.name
			)
		).map(([date, data]) => [new Date(date), data]);

		interpolateValue = (data: Record[], date: Date): number => {
			const bisectDate = bisector((d: Record) => d.date).left;
			const i = bisectDate(data, date);
			if (i === 0) return data[0].value;
			if (i === data.length) return data[data.length - 1].value;
			const d0 = data[i - 1];
			const d1 = data[i];
			const t = (date.valueOf() - d0.date.valueOf()) / (d1.date.valueOf() - d0.date.valueOf());
			return Math.floor(d0.value + t * (d1.value - d0.value));
		};

		rank = (valueFn: (name: string) => number): KeyframeRecord[] => {
			const data: KeyframeRecord[] = Array.from(names, (name) => ({
				name,
				value: valueFn(name)
			})).sort((a, b) => descending(a.value, b.value));
			data.forEach((d, i) => (d.rank = Math.min(maxBars, i)));
			return data;
		};

		keyframes = [];
		for (const [[ka, a], [kb, b]] of pairs(dateValues)) {
			for (let i = 0; i <= 10; i++) {
				const t = i / 10;
				const kfDate = new Date(Number(ka.valueOf()) * (1 - t) + Number(kb.valueOf()) * t);
				keyframes.push([
					kfDate,
					rank((name) => interpolateValue(grouping.get(name) as Record[], kfDate))
				]);
			}
		}

		togglePlay();
	});

	function run(start: number = 0) {
		current = start;
		intervalId = setInterval(() => {
			if (current >= keyframes.length) {
				playing = false;
				current = 0;
				clearInterval(intervalId);
				return;
			}

			ticker = formatTicker(keyframes[current][0]);
			keyframeItems = keyframes[current][1];
			xScale.domain([0, keyframeItems[0]?.value ?? 1]);
			currentDateIndex = current;
			current++;
		}, duration);
	}

	function togglePlay() {
		playing = !playing;
		if (playing) {
			run(current);
		} else {
			clearInterval(intervalId);
		}
	}

	function moveSlider(index: number) {
		currentDateIndex = index;
		ticker = formatTicker(keyframes[currentDateIndex][0]);
		keyframeItems = keyframes[currentDateIndex][1];
		xScale.domain([0, keyframeItems[0]?.value ?? 1]);
	}

	function barExit(_: SVGGElement) {
		return { duration: duration * 2, css: (t: number) => `opacity: ${t};` };
	}

	function barEnter(_: SVGGElement) {
		return { duration: duration * 2, css: (t: number) => `opacity: ${t};` };
	}

	function onSliderInput(event: Event) {
		current = (event.target as HTMLInputElement).valueAsNumber;
		moveSlider(current);
	}
</script>

<svg width="100%" height="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
	<g fill-opacity="0.6">
		{#each keyframeItems.slice(0, maxBars) as item (item.name)}
			{#if item.value > 0}
				<g in:barEnter out:barExit>
					<rect
						fill={colorScale(item.name)}
						height={yScale.bandwidth()}
						x={xScale(0)}
						style={`transition: width ${duration / 1000}s linear, transform ${duration / 1000}s linear; width: ${xScale(item.value) - xScale(0)}px; transform: translateY(${yScale(item.rank || 0)}px);`}
					/>
					<text
						text-anchor="end"
						font-weight="bold"
						font-size="12"
						y={yScale.bandwidth() / 2}
						x="-6"
						dy="-0.25em"
						style={`transition: transform ${duration / 1000}s linear; transform: translate3d(${xScale(item.value) - xScale(0)}px, ${yScale(item.rank || 0)}px, 0);`}
					>
						{item.name}
						<tspan fill-opacity="0.7" font-weight="normal" x="-6" dy="1.15em"> {item.value}</tspan>
					</text>
				</g>
			{/if}
		{/each}
	</g>
	{#if ticker}
		<text
			y={dimensions.margin.top + barSize * (maxBars - 0.45) + 50}
			x={dimensions.width - 6}
			text-anchor="end"
			font-weight="light"
			fill="#64748B"
			font-size={`${barSize}px`}
			dy="0.32em">{ticker}</text
		>
	{/if}
</svg>

<div class="rounded-3xl bg-slate-200 flex align-center items-center px-5 py-2">
	<button on:click={togglePlay} class="focus:outline-none">
		{#if playing}
			<!-- Pause Icon -->
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="#64748B"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-6 w-6"
			>
				<rect x="6" y="4" width="4" height="12"></rect>
				<rect x="14" y="4" width="4" height="12"></rect>
			</svg>
		{:else}
			<!-- Play Icon -->
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="#64748B"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="h-6 w-6"
			>
				<polygon points="5 3 19 12 5 21 5 3"></polygon>
			</svg>
		{/if}
	</button>
	<input
		type="range"
		class="w-full"
		min="0"
		max={keyframes.length - 1}
		step="1"
		value={currentDateIndex}
		on:input={(event) => onSliderInput(event)}
	/>
</div>
