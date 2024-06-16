<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import 'c3/c3.min.css';

	let c3;
	let chartElement: HTMLDivElement;

	onMount(async () => {
		c3 = await import('c3');
		const csvData = await d3.csv('data/owid-covid-data-quarterly.csv');
		const parseDate = d3.timeParse('%Y-%m-%d');
		const data = csvData.map((d) => ({
			date: parseDate(d.date),
			total_cases: +d.total_cases || 0,
			people_vaccinated: +d.people_vaccinated || 0,
			people_fully_vaccinated: +d.people_fully_vaccinated || 0,
			total_boosters: +d.total_boosters || 0
		}));

		// Prepare data for chart without scaling to billions to check visibility
		const filteredData = data.filter(
			(d) => d.date >= new Date('2020-01-01') && d.date <= new Date('2024-05-01')
		);

		c3.generate({
			bindto: chartElement,
			data: {
				x: 'date',
				json: filteredData,
				keys: {
					x: 'date',
					value: ['total_cases', 'people_vaccinated', 'people_fully_vaccinated', 'total_boosters']
				},
				types: {
					total_cases: 'area-spline',
					people_vaccinated: 'area-spline',
					people_fully_vaccinated: 'area-spline',
					total_boosters: 'area-spline'
				}
			},
			axis: {
				x: {
					type: 'timeseries',
					tick: {
						format: '%Y-%m-%d'
					},

					label: {
						text: 'Date',
						position: 'outer-center'
					}
				},
				y: {
					tick: {
						format: (d) => {
							const formatted = d3.format('.3s')(d);
							return formatted.replace('G', 'B');
						}
					},
					label: {
						text: 'Count',
						position: 'outer-middle'
					}
				}
			},
			tooltip: {
				format: {
					value: function (value, _ratio, _id) {
						return d3.format(',')(value);
					}
				}
			}
		});
	});
</script>

<div bind:this={chartElement}></div>
