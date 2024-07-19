export enum FilterTypeMap {
	'all' = 'All',
	'stableCoin' = 'USDC',
	'onCrypto' = 'clCrypto',
	'onCommodity' = 'clCommodity',
}
export type FilterType = keyof typeof FilterTypeMap

export enum FilterTypeColorMap {
	'all' = '#ffffff',
	'stableCoin' = '#6800ed',
	'onCrypto' = '#c4b5fd',
	'onCommodity' = '#fffc72',
}

export interface PieItem {
	key: number
	name: string
	value: number
	onusdAmount: number
}