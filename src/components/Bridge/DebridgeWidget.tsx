import Script from 'next/script'
import { useEffect, useState } from 'react'
import { LoadingProgress } from '../Common/Loading'
import { Box } from '@mui/material'


const DebridgeWidget = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  const setWidget = () => {
    window.deBridge.widget({ "v": "1", "element": "debridgeWidget", "title": "", "description": "", "width": "330", "height": "540", "r": "7420", "affiliateFeePercent": "0.1", "affiliateFeeRecipient": "0x9b50aa48916bbf8e08b89b1609e3444115708e78", "supportedChains": "{\"inputChains\":{\"1\":\"all\",\"10\":\"all\",\"56\":\"all\",\"137\":\"all\",\"8453\":\"all\",\"42161\":\"all\",\"43114\":\"all\",\"59144\":\"all\",\"7565164\":\"all\",\"245022934\":\"all\"},\"outputChains\":{\"1\":\"all\",\"10\":\"all\",\"56\":\"all\",\"137\":\"all\",\"8453\":\"all\",\"42161\":\"all\",\"43114\":\"all\",\"59144\":\"all\",\"7565164\":[\"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\"],\"245022934\":\"all\"}}", "inputChain": 1, "outputChain": 7565164, "inputCurrency": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "outputCurrency": "", "address": "", "showSwapTransfer": true, "amount": "", "outputAmount": "", "isAmountFromNotModifiable": false, "isAmountToNotModifiable": false, "lang": "en", "mode": "deswap", "isEnableCalldata": false, "styles": "eyJhcHBCYWNrZ3JvdW5kIjoiIzA4MDAxOCIsImFwcEFjY2VudEJnIjoiIzA4MDAxOCIsImNoYXJ0QmciOiIjMDgwMDE4IiwiYmFkZ2UiOiIjYzRiNWZkIiwiYm9yZGVyUmFkaXVzIjoxMCwiZm9ybUNvbnRyb2xCZyI6InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIsImRyb3Bkb3duQmciOiIjMDAwMDAwIiwicHJpbWFyeSI6IiNjNGI1ZmQiLCJzZWNvbmRhcnkiOiJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLCJsaWdodCI6IiNjNGI1ZmQiLCJzdWNjZXNzIjoiI2M0YjVmZCIsImljb25Db2xvciI6IiNjNGI1ZmQiLCJmb250Q29sb3JBY2NlbnQiOiIjYzRiNWZkIiwiZm9udEZhbWlseSI6IkludGVyIiwicHJpbWFyeUJ0blRleHQiOiIjMDAwMDAwIiwic2Vjb25kYXJ5QnRuVGV4dCI6IiNmZmZmZmYiLCJsaWdodEJ0blRleHQiOiIjMDAwMDAwIn0=", "theme": "dark", "isHideLogo": false, "logo": "" })
  }

  useEffect(() => {
    if (window.deBridge && !isLoaded) {
      if (document.querySelector('.debridge-widget-iframe') === null) {
        setWidget()
        setTimeout(() => {
          setShowLoading(false)
        }, 2000)
      }
    }
  }, [])

  useEffect(() => {
    if (window.deBridge && isLoaded) {
      if (document.querySelector('.debridge-widget-iframe') === null) {
        setWidget()
        setTimeout(() => {
          setShowLoading(false)
        }, 2000)
      }
    }
  }, [isLoaded])

  const onLoad = () => {
    console.log('load')
    setIsLoaded(true)
  }

  return (
    <>
      <Script src="https://app.debridge.finance/assets/scripts/widget.js" onLoad={onLoad} />
      {showLoading && <Box position='absolute' top='55px' ml='15px' width='315px'><LoadingProgress /></Box>}
      <div id="debridgeWidget" style={{ marginTop: '0px' }}></div>
    </>
  )
}

export default DebridgeWidget