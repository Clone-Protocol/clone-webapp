'use client'
import { createContext, useContext } from 'react'

export interface DataLoadingContextState {
	startTimer: boolean
	setStartTimer: (start: boolean) => void
}

export const DataLoadingContext = createContext<DataLoadingContextState>({} as DataLoadingContextState)

export function useDataLoading(): DataLoadingContextState {
	return useContext(DataLoadingContext)
}
