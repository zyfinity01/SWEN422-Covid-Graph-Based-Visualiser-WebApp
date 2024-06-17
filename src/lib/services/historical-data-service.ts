import type { HistoricalCountryCovidModel as HistoricalCovidModel } from '$lib/models/historical-covid-model';
import type { HistoricalWhoRegionModel } from '$lib/models/historical-who-region-model';
import type { WhoRegionModel } from '$lib/models/who-region-model';
import * as d3 from 'd3';

export async function loadHistoricalCovidData(): Promise<HistoricalCovidModel[]> {
	const data: HistoricalCovidModel[] = await d3.csv('data/who-covid-historical.csv', (d) => ({
		dateReported: new Date(d['Date_reported']),
		countryCode: d['Country_code'],
		country: d['Country'],
		whoRegion: d['WHO_region'],
		newCases: +d['New_cases'],
		cumulativeCases: +d['Cumulative_cases'],
		newDeaths: +d['New_deaths'],
		cumulativeDeaths: +d['Cumulative_deaths']
	}));
	return data;
}

export function filterWeeklyDataByAll(
	data: HistoricalCovidModel[],
	region: WhoRegionModel
): HistoricalWhoRegionModel {
	const filteredData = filterHistoricalCovidData(data, (d) => true);
	const aggregateData = aggregateHistoricalData(filteredData, region);

	return {
		region,
		data: aggregateData,
		final: aggregateData[aggregateData.length - 1]
	};
}


export function filterWeeklyDataByRegion(
	data: HistoricalCovidModel[],
	region: WhoRegionModel
): HistoricalWhoRegionModel {
	const filteredData = filterHistoricalCovidData(data, (d) => d.whoRegion === region.code);
	const aggregateData = aggregateHistoricalData(filteredData, region);

	return {
		region,
		data: aggregateData,
		final: aggregateData[aggregateData.length - 1]
	};
}

function aggregateHistoricalData(
	data: HistoricalCovidModel[],
	region: WhoRegionModel
): HistoricalCovidModel[] {
	const groupedByWeek = new Map<string, HistoricalCovidModel>();

	data.forEach((record) => {
		const weekStart = d3.timeWeek.floor(record.dateReported);
		const weekKey = weekStart.toISOString();

		if (!groupedByWeek.has(weekKey)) {
			groupedByWeek.set(weekKey, {
				country: region.name,
				countryCode: region.code,
				dateReported: weekStart,
				whoRegion: region.code,
				newCases: 0,
				cumulativeCases: 0,
				newDeaths: 0,
				cumulativeDeaths: 0
			});
		}

		const weeklyRecord = groupedByWeek.get(weekKey)!;
		weeklyRecord.newCases += record.newCases;
		weeklyRecord.cumulativeCases = record.cumulativeCases;
		weeklyRecord.newDeaths += record.newDeaths;
		weeklyRecord.cumulativeDeaths = record.cumulativeDeaths;
	});

	return Array.from(groupedByWeek.values());
}

export function filterHistoricalCovidData(
	data: HistoricalCovidModel[],
	criteria: (d: HistoricalCovidModel) => boolean
): HistoricalCovidModel[] {
	return data.filter(criteria);
}
