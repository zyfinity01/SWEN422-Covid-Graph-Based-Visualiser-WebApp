import type { HistoricalCountryCovidModel } from './historical-covid-model';
import type { WhoRegionModel } from './who-region-model';

export interface HistoricalWhoRegionModel {
	region: WhoRegionModel;
	data: HistoricalCountryCovidModel[];
	final: HistoricalCountryCovidModel;
}
