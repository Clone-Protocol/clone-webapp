import { Button, Typography } from "@mui/material"
import { styled } from '@mui/material/styles'
import { Status } from "clone-protocol-sdk/sdk/generated/clone"
import Image from "next/image"
import WarningExtraction from 'public/images/pool-status/warning-extraction.svg'
import WarningFrozen from 'public/images/pool-status/warning-frozen.svg'
import WarningLiquidation from 'public/images/pool-status/warning-liquidation.svg'

export const showPoolStatus = (status: Status) => {
  return status === Status.Frozen || status === Status.Extraction || status === Status.Liquidation
}

export const PoolStatusButton = ({ status }: { status: Status }) => {
  if (status === Status.Frozen) {
    return <FrozenButton />
  } else if (status === Status.Extraction) {
    return <ExtractionButton />
  } else if (status === Status.Liquidation) {
    return <LiquidationButton />
  } else {
    <></>
  }
}

export const FrozenButton = () => {
  return (
    <a href="https://docs.clone.so/clone-mainnet-guide/pool-status" target="_blank">
      <CustomButton sx={{ backgroundColor: 'rgba(255, 142, 79, 0.2)', ':hover': { backgroundColor: 'rgba(255, 142, 79, 0.35)' } }}>
        <Image src={WarningFrozen} alt='frozen' /> <Typography variant='p'>Frozen</Typography>
      </CustomButton>
    </a>
  )
}

export const ExtractionButton = () => {
  return (
    <a href="https://docs.clone.so/clone-mainnet-guide/pool-status" target="_blank">
      <CustomButton sx={{ backgroundColor: 'rgba(79, 229, 255, 0.2)', ':hover': { backgroundColor: 'rgba(79, 229, 255, 0.35)' } }}>
        <Image src={WarningExtraction} alt='extraction' /> <Typography variant='p'>Extraction</Typography>
      </CustomButton>
    </a>
  )
}

export const LiquidationButton = () => {
  return (
    <a href="https://docs.clone.so/clone-mainnet-guide/pool-status" target="_blank">
      <CustomButton sx={{ backgroundColor: 'rgba(237, 37, 37, 0.2)', ':hover': { backgroundColor: 'rgba(237, 37, 37, 0.35)' } }}>
        <Image src={WarningLiquidation} alt='frozen' /> <Typography variant='p'>Liquidation</Typography>
      </CustomButton>
    </a>
  )
}

const CustomButton = styled(Button)`
  width: 100px;
  height: 36px;
  border-radius: 5px;
  color: #fff;
  display: flex;
  justify-content: center;
  gap: 5px;
`