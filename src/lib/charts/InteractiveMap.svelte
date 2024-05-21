<script lang="ts">
	import { onMount } from 'svelte';
	import { csv, json, geoNaturalEarth1, geoPath, scaleLinear, select } from 'd3';
	import type { GeoPermissibleObjects } from 'd3';
	import type { FeatureCollection, Geometry } from 'geojson';
  
	let svgElement: SVGSVGElement;
  
	interface CountryData {
	  iso_code: string;
	  total_cases: string;
	  location: string;
	}
  
	type GeoJson = FeatureCollection<Geometry, { iso_a3: string }>;
  
	let tooltip = '';
	let showTooltip = false;
	let tooltipX = 0;
	let tooltipY = 0;
  
	onMount(async () => {
	  const covidData: CountryData[] = await csv('data/owid-covid-latest.csv');
	  const worldData = await json<GeoJson>('data/custom.geo.json');
	  
	  if (!worldData) {
		console.error("Failed to load world data.");
		return;
	  }
  
	  const svg = select(svgElement);
	  const projection = geoNaturalEarth1().fitSize([960, 600], worldData as GeoPermissibleObjects);
	  const pathGenerator = geoPath().projection(projection);
  
	  const casesMax = Math.max(...covidData.map(d => +d.total_cases));
	  const colorScale = scaleLinear<string>()
		.domain([0, casesMax])
		.range(['#ccc', '#b00']);
  
	  svg.selectAll('path')
		.data(worldData.features)
		.enter().append('path')
		.attr('d', pathGenerator)
		.attr('fill', d => {
		  const countryData = covidData.find(cd => cd.iso_code === d.properties.iso_a3);
		  return countryData ? colorScale(+countryData.total_cases) : '#eee';
		})
		.on('mouseover', (event, d) => {
		  const countryData = covidData.find(cd => cd.iso_code === d.properties.iso_a3);
		  tooltip = countryData ? `${countryData.location}: ${countryData.total_cases} cases` : "No data";
		  showTooltip = true;
		  tooltipX = event.clientX;
		  tooltipY = event.clientY;
		})
		.on('mousemove', (event) => {
		  tooltipX = event.clientX;
		  tooltipY = event.clientY;
		})
		.on('mouseout', () => {
		  showTooltip = false;
		});
	});
  </script>
  
  <svg bind:this={svgElement} width="960" height="600"></svg>
  {#if showTooltip}
	<div style="position: absolute; left: {tooltipX}px; top: {tooltipY}px; background-color: white; padding: 5px; border: 1px solid black;">
	  {tooltip}
	</div>
  {/if}
  