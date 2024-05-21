export interface HistoricalCountryCovidModel {
	dateReported: Date;
	countryCode: string;
	country: string;
	whoRegion: string;
	newCases: number;
	cumulativeCases: number;
	newDeaths: number;
	cumulativeDeaths: number;
}
