'use client'
import React, { FC, ReactNode, useState } from 'react'
import { DataLoadingContext } from '~/hooks/useDataLoading'
import { SnackbarProvider } from 'notistack'

export const DataLoadingIndicatorProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [startTimer, setStartTimer] = useState(false)

	return (
		<SnackbarProvider maxSnack={3}>
			<DataLoadingContext.Provider
				value={{
					startTimer,
					setStartTimer,
				}}>
				{children}
			</DataLoadingContext.Provider>
		</SnackbarProvider>
	)
}
