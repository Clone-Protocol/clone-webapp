'use client'
import QueryProvider from '~/hocs/QueryClient'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '~/theme'
import GNB from '~/components/GNB'
import Box from '@mui/material/Box'
import ClientWalletProvider from '~/hocs/ClientWalletProvider'
import { DataLoadingIndicatorProvider } from '~/hocs/DataLoadingIndicatorProvider'
import { Provider as JotaiProvider } from 'jotai'
import { TransactionStateProvider } from '~/hocs/TransactionStateProvider'
import ErrorBoundary from '~/components/ErrorBoundary'
import { styled } from '@mui/material/styles'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const [isCompleteInit, _] = useLocalStorage(IS_COMPLETE_INIT, false)
  // const [isOpenInit, setIsOpenInit] = useState(false)
  // const InitEnterScreen = dynamic(() => import('~/components/Common/InitEnterScreen'), { ssr: false })

  // useEffect(() => {
  //   if (!isCompleteInit) {
  //     setIsOpenInit(true)
  //   }
  // }, [isCompleteInit])

  return (
    <QueryProvider>
      <JotaiProvider>
        <ThemeProvider theme={theme}>
          <ClientWalletProvider>
            <TransactionStateProvider>
              <DataLoadingIndicatorProvider>
                <ErrorBoundary>
                  <Box sx={{ display: 'flex', backgroundColor: '#0f0e14' }}>
                    <CssBaseline />
                    <GNB />

                    <Box
                      component="main"
                      sx={{
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                      }}>
                      {children}
                    </Box>
                    {/* {IS_DEV && isOpenInit && <InitEnterScreen onClose={() => setIsOpenInit(false)} />} */}
                  </Box>
                </ErrorBoundary>
              </DataLoadingIndicatorProvider>
            </TransactionStateProvider>
          </ClientWalletProvider>
        </ThemeProvider>
      </JotaiProvider>
    </QueryProvider>
  )
}

export const StyledSection = styled('section')`
	max-width: 1085px;
	margin: 0 auto;
  padding-bottom: 20px;
	${(props) => props.theme.breakpoints.up('md')} {
		padding-top: 120px;
	}
	${(props) => props.theme.breakpoints.down('md')} {
		padding: 110px 0px;
	}
`