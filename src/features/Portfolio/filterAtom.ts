import { atom } from 'jotai'

export const DEFAULT_ALL_INDEX = -1
export const STABLE_COIN_INDEX = 999

export const filterState = atom(DEFAULT_ALL_INDEX) // default: all