import React, { useMemo, useState } from 'react'
import { Box, Dialog, DialogContent, Typography, Button, MenuItem, Stack, Input, useMediaQuery, Theme } from '@mui/material'
import { styled } from '@mui/material/styles'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FadeTransition } from '~/components/Common/Dialog'
import { CloseButton } from '~/components/Common/CommonButtons'
import { IndicatorGreen, IndicatorRed, IndicatorStatus, IndicatorYellow } from './StatusIndicator';
import IconShare from 'public/images/icon-share.svg'
import { useSnackbar } from 'notistack';
import { useAtom, useSetAtom } from 'jotai';
import { priorityFee, priorityFeeIndex, rpcEndpoint, rpcEndpointIndex } from '~/features/globalAtom';
import { CUSTOM_RPC_INDEX, DEFAULT_PRIORITY_FEE_INDEX, DEVNET_PUBLIC, DEV_RPCs, IS_DEV, MAINNET_PUBLIC, MAIN_RPCs, PRIORITY_FEES } from '~/data/networks';
import Image from 'next/image';
import { measureRPCPings } from '~/utils/network_ping';

const SettingDialog = ({ open, handleClose }: { open: boolean, handleClose: () => void }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [atomRpcEndpointIndex, setAtomRpcEndpointIndex] = useAtom(rpcEndpointIndex)
  const setAtomRpcEndpoint = useSetAtom(rpcEndpoint)
  const [atomPriorityFeeIndex, setAtomPriorityFeeIndex] = useAtom(priorityFeeIndex)
  const setAtomPriorityFee = useSetAtom(priorityFee)

  const [showCustom, setShowCustom] = useState(false)
  const [customUrl, setCustomUrl] = useState('')
  const [errorCustomMsg, setErrorCustomMsg] = useState(false)
  const RPCs = IS_DEV ? DEV_RPCs : MAIN_RPCs
  const [arrPingTimes, setArrPingTimes] = useState<(number | undefined)[]>([])
  const isMobileOnSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  useMemo(() => {
    const fetchPing = async () => {
      if (open) {
        const pingTimes = await measureRPCPings(MAIN_RPCs.map(x => x.rpc_url));
        setArrPingTimes(pingTimes)
      }
    }
    fetchPing()
  }, [open])

  const handleChangeRpcEndpoint = (event: SelectChangeEvent) => {
    const rpcIndex = Number(event.target.value)
    setShowCustom(rpcIndex == CUSTOM_RPC_INDEX)

    setAtomRpcEndpointIndex(rpcIndex);

    if (rpcIndex != CUSTOM_RPC_INDEX) {
      setAtomRpcEndpoint(RPCs[rpcIndex].rpc_url)

      enqueueSnackbar(`Connected to ${RPCs[rpcIndex].rpc_name}`)
    }
  };

  const goNetwork = () => {
    if (IS_DEV) {
      window.open(MAINNET_PUBLIC, '_blank')
    } else {
      window.open(DEVNET_PUBLIC, '_blank')
    }
  };

  const handleChangeCustomRPCUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(event.target.value)
  }

  const saveCustomURL = () => {
    const urlRegex = /^(http:\/\/|https:\/\/).+/;
    if (customUrl && urlRegex.test(customUrl)) {
      setAtomRpcEndpointIndex(CUSTOM_RPC_INDEX);
      setAtomRpcEndpoint(customUrl.trim())
      setErrorCustomMsg(false)
      enqueueSnackbar('Connected to Custom RPC')
    } else {
      setErrorCustomMsg(true)
      enqueueSnackbar('Custom RPC connection failed, please try a different custom RPC URL.')
    }
  }

  const handleChangePriorityFee = (event: SelectChangeEvent) => {
    const feeIndex = Number(event.target.value)
    setAtomPriorityFeeIndex(feeIndex);
    setAtomPriorityFee(PRIORITY_FEES[feeIndex].fee_level)
  }

  const StatusIndicator = ({ speed }: { speed: number | undefined }) => {
    let status = IndicatorStatus.Green
    if (speed && speed > 200) {
      status = IndicatorStatus.Yellow
    } else if (speed && speed > 400) {
      status = IndicatorStatus.Red
    }

    return (
      <Stack direction='row' alignItems='center' gap={1}>
        <Box><Typography variant='p_sm' color='#c5c7d9'>{speed ? speed.toFixed(1) : '0'}ms</Typography></Box>
        {status === IndicatorStatus.Green ?
          <IndicatorGreen />
          : status === IndicatorStatus.Yellow ?
            <IndicatorYellow />
            :
            <IndicatorRed />
        }
      </Stack>
    )
  }

  const CommonSelectBox = ({ children, value, handleChange }: { children: React.ReactNode, value: number, handleChange: (event: SelectChangeEvent) => void }) => {
    return (
      <SelectBox
        value={value}
        onChange={handleChange}
        sx={{
          padding: '0px',
          '& .MuiSelect-icon': {
            color: '#fff'
          },
          "&.MuiOutlinedInput-root": {
            "& fieldset": {
              border: '1px solid #343441',
            },
            "&:hover fieldset": {
              borderColor: "#c4b5fd !important"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#343441"
            }
          }
        }}
        MenuProps={{
          disablePortal: isMobileOnSize ? false : true,
          PaperProps: {
            sx: {
              zIndex: 999999,
              border: '1px solid #343441',
              '& .MuiMenu-list': {
                padding: 0,
                '&:hover': {
                  backgroundColor: '#000',
                }
              },
              '& .Mui-selected': {
                backgroundColor: '#000 !important',
              },
            }
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left"
          },
        }}
      >
        {children}
      </SelectBox>
    )
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} TransitionComponent={FadeTransition}>
        <DialogContent sx={{ backgroundColor: '#080018', border: '1px solid #414166', borderRadius: '10px', width: { xs: '100%', md: '375px' } }}>
          <BoxWrapper>
            <Typography variant='h3' fontWeight={500}>App Settings</Typography>
            {!IS_DEV &&
              <Box>
                <Box my='20px'>
                  <Box><Typography variant="p_lg">RPC Endpoint</Typography></Box>
                  <Box lineHeight={1} mb='7px'><Typography variant="p" color="#8988a3">At anytime, choose the fastest RPC for the most optimal experience!</Typography></Box>
                  <CommonSelectBox value={atomRpcEndpointIndex} handleChange={handleChangeRpcEndpoint}>
                    {RPCs.map((rpc, index) => (
                      <SelectMenuItem key={index} value={index}>
                        <Stack direction='row' alignItems='center' gap={1}>
                          <Typography variant='p'>{rpc.rpc_name}</Typography>
                          <StatusIndicator speed={arrPingTimes[index]} />
                        </Stack>
                      </SelectMenuItem>
                    ))}
                    <SelectMenuItem value={CUSTOM_RPC_INDEX}><Typography variant='p'>Custom</Typography></SelectMenuItem>
                  </CommonSelectBox>
                  {showCustom &&
                    <Box>
                      <StyledInput placeholder="Enter custom RPC URL" disableUnderline onChange={handleChangeCustomRPCUrl} sx={{ width: { xs: '100%', md: '322px' } }} />
                      {errorCustomMsg && <Box><Typography variant='p' color='#ed2525'>Custom RPC Connection Failed. Try different URL.</Typography></Box>}
                      <SaveBtn onClick={saveCustomURL}>Save</SaveBtn>
                    </Box>
                  }
                </Box>

                <Box my='20px'>
                  <Box><Typography variant="p_lg">Priority Fee Setting</Typography></Box>
                  <Box lineHeight={1} mb='7px'><Typography variant="p" color="#8988a3">Expedite your transaction with higher priority fees. Please visit Helius web page to <a href="https://docs.helius.dev/solana-rpc-nodes/alpha-priority-fee-api" target='_blank' style={{ color: '#fff', textDecoration: 'underline' }}>learn more.</a></Typography></Box>
                  <CommonSelectBox value={atomPriorityFeeIndex} handleChange={handleChangePriorityFee}>
                    {PRIORITY_FEES.map((fee, index) => (
                      <SelectMenuItem key={index} value={index}>
                        <Stack direction='row' alignItems='center' gap={1}>
                          <Typography variant='p'>{fee.fee_name}</Typography>
                          {index === DEFAULT_PRIORITY_FEE_INDEX && <Typography variant='p' color='#c4b5fd'>(Recommended)</Typography>}
                          {/* {fee.fee > 0 && <Typography variant='p_sm' color='#c5c7d9'>{fee.fee} SOL</Typography>} */}
                        </Stack>
                      </SelectMenuItem>
                    ))}
                  </CommonSelectBox>
                </Box>
              </Box>
            }
            <Box my='20px'>
              <Box><Typography variant="p_lg">Network Switching</Typography></Box>
              <Box lineHeight={1} mb='7px'><Typography variant="p" color="#8988a3">Choose between Solana mainnet and devnet. Learn more <a href="#" target="_blank" style={{ textDecoration: 'underline', color: '#fff' }}>here</a>.</Typography></Box>
              <ChangeNetworkButton onClick={goNetwork}><Typography variant='p'>Go to Solana {IS_DEV ? 'Mainnet' : 'Devnet'}</Typography> <Image src={IconShare} alt='icon-share' /></ChangeNetworkButton>
            </Box>
            <Box sx={{ position: 'absolute', right: '10px', top: '10px' }}>
              <CloseButton handleClose={handleClose} />
            </Box>
          </BoxWrapper>
        </DialogContent>
      </Dialog>
    </>
  )
}

const BoxWrapper = styled(Box)`
  color: #fff;
  overflow-x: hidden;
  max-width: 335px;
`
const SelectBox = styled(Select)`
  width: 229px;
  height: 36px;
  padding: 10px;
  border-radius: 5px;
  background: #000;
`
const SelectMenuItem = styled(MenuItem)`
  display: flex;
  padding: 10px;
  background: #000;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`
const StyledInput = styled(Input)`
  border: solid 1px #343441;
  height: 36px;
  margin-top: 7px;
  border-radius: 5px;
  & input {
    padding-left: 13px;  
    font-size: 12px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #fff;

    &::placeholder {
      color: #fff;
    }
  }
  
  &:hover {
    border: solid 1px ${(props) => props.theme.basis.melrose};
  }
`
const ChangeNetworkButton = styled(Box)`
  width: 209px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  padding: 6px 11px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`
const SaveBtn = styled(Button)`
  width: 107px;
  height: 30px;
  border-radius: 5px;
  margin-top: 7px;
  background-color: ${(props) => props.theme.basis.melrose};
  &:hover {
    background-color: ${(props) => props.theme.basis.melrose};
  }
`

export default SettingDialog

