import { IS_DEV } from "~/data/networks"

export const RootMarketsDir = "/markets"
export const RootLiquidityDir = "/liquidity"
export const CloneTokenDir = "/clone"

export const RouteMarkets = {
	TRADE_LIST: `${RootMarketsDir}`,
	TRADE: `${RootMarketsDir}/trade`,
	PORTFOLIO: `${RootMarketsDir}/clportfolio`,
	POINTS: `${RootMarketsDir}/points`,
	GIVEAWAY: `${RootMarketsDir}/giveaway`,
}

export enum CreateAccountDialogStates {
	Closed,
	Initial,
	Reminder
}

export enum ReferralStatus {
	NotAllowed,
	NotGenerated,
	Generated
}

export const NETWORK_NAME = IS_DEV ? "Devnet" : ""

export const ON_USD = IS_DEV ? "devUSD" : "USDC"

export const ON_USD_NAME = IS_DEV ? "Devnet USD" : "USDC"

export const IS_NOT_LOCAL_DEVELOPMENT = process.env.NEXT_PUBLIC_IS_DEBUG_SENTRY !== 'true'