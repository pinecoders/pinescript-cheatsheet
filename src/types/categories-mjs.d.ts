declare module '@/constants/categories.mjs' {
	export const Category: {
		readonly ScriptTypes: 'Script Types';
		readonly Types: 'Types';
		readonly Annotations: 'Annotations';
		readonly Keywords: 'Keywords';
		readonly Operators: 'Operators';
		readonly BarData: 'Bar Data';
		readonly Colors: 'Colors';
		readonly Strings: 'Strings';
		readonly Maths: 'Maths';
		readonly Maps: 'Maps';
		readonly Arrays: 'Arrays';
		readonly Matrixes: 'Matrixes';
		readonly BarState: 'Bar State';
		readonly ChartTypesPoints: 'Chart Types & Points';
		readonly Currency: 'Currency';
		readonly Datetime: 'Datetime';
		readonly Plotting: 'Plotting';
		readonly Indicators: 'Indicators';
		readonly Inputs: 'Inputs';
		readonly Labels: 'Labels';
		readonly Lines: 'Lines';
		readonly Boxes: 'Boxes';
		readonly Polylines: 'Polylines';
		readonly Alerts: 'Alerts';
		readonly Syminfo: 'Symbol Info';
		readonly Requests: 'Requests';
		readonly Sessions: 'Sessions';
		readonly Timeframe: 'Timeframe';
		readonly Strategy: 'Strategy';
		readonly Tables: 'Tables';
		readonly LoggingDebugging: 'Logging & Debugging';
		readonly TextsFormatting: 'Texts & Formatting';
		readonly PositionsLocations: 'Positions & Locations';
		readonly StylingLayout: 'Styling & Layout';
	};

	export type CategoryKey = keyof typeof Category;
	export type CategoryValue = (typeof Category)[CategoryKey];

	export const CATEGORY_COLUMNS: Record<CategoryValue, number>;
	export const NUMBER_OF_COLUMNS: number;
}
