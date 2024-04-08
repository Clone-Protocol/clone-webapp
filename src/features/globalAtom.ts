import { Clone, Pools } from 'clone-protocol-sdk/sdk/generated/clone'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { atom } from 'jotai'
import { DEFAULT_PRIORITY_FEE_INDEX, PRIORITY_FEES, DEV_RPCs, IS_DEV, MAIN_RPCs } from '~/data/networks'
import { CreateAccountDialogStates } from '~/utils/constants'
import { FeeLevel } from '~/data/networks'

export const showPythBanner = atom(false)

export const mintUSDi = atom(false)

export const syncFetchNetworkState = atom(false)

export const isAlreadyInitializedAccountState = atom(true)

export const createAccountDialogState = atom(CreateAccountDialogStates.Closed)

export const declinedAccountCreationState = atom(false)

export const isCreatingAccountState = atom(false)

export const openConnectWalletGuideDlogState = atom(false)

export const connectedPubKey = atom('')

export const rpcEndpointIndex = atom(0)

export const rpcEndpoint = atom(IS_DEV ? DEV_RPCs[0].rpc_url : MAIN_RPCs[0].rpc_url)

export const priorityFeeIndex = atom(DEFAULT_PRIORITY_FEE_INDEX)

export const priorityFee = atom<FeeLevel>(PRIORITY_FEES[DEFAULT_PRIORITY_FEE_INDEX].fee_level)

// for clone specific atoms
export const cloneClient = atom<CloneClient | null>(null)

export const cloneAccount = atom<Clone | null>(null)

export const clonePools = atom<Pools | null>(null)