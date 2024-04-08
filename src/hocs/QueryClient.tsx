'use client'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { cache } from 'react'

// export const getQueryClient = cache(() => new QueryClient())

// export const queryClient = new QueryClient({
// 	defaultOptions: {
// 		queries: {
// 			staleTime: 1000 * 60 * 5,
// 			suspense: true,
// 		},
// 	},
// })

const QueryProvider = ({ children }: { children: any }) => {
	const [queryClient] = useState(new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5,
				suspense: true,
			},
		},
	}))

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default QueryProvider
