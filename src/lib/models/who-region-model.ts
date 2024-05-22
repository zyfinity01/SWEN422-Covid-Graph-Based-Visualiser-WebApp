import type { HistoricalCountryCovidModel } from "./historical-covid-model";

export interface WhoRegionModel {
    whoRegion: string;
    data: HistoricalCountryCovidModel[];
    final: HistoricalCountryCovidModel;
}