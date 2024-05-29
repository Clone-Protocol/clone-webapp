import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js"
import {
  getAssociatedTokenAddressSync,
  getAccount,
  createAssociatedTokenAccountIdempotentInstruction,
} from "@solana/spl-token"
import { BN } from "@coral-xyz/anchor"
import {
  CloneStaking as ClnStakingInfo,
  User as UserStaking,
  createAddStakeInstruction,
  createWithdrawStakeInstruction,
} from "clone-protocol-sdk/sdk/generated/clone-staking"

export const CLONE_STAKING_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_CLONE_STAKING_PROGRAM_ID!)
export const CLN_TOKEN_MINT = new PublicKey(process.env.NEXT_PUBLIC_CLN_TOKEN_MINT!)
export const CLN_TOKEN_SCALE = 8

const getCloneStakingAccounts = (): {
  clnStakingAccountAddress: PublicKey
  clnTokenVault: PublicKey
} => {
  const [cloneStakingAddress, _] = PublicKey.findProgramAddressSync(
    [Buffer.from("clone-staking")],
    CLONE_STAKING_PROGRAM_ID
  )
  const clnTokenVault = getAssociatedTokenAddressSync(CLN_TOKEN_MINT, cloneStakingAddress, true)

  return { clnStakingAccountAddress: cloneStakingAddress, clnTokenVault }
}

const getStakingAccountAddress = (userPubkey: PublicKey): PublicKey => {
  const [userStakingAddress, __] = PublicKey.findProgramAddressSync(
    [Buffer.from("user"), userPubkey.toBuffer()],
    CLONE_STAKING_PROGRAM_ID
  )
  return userStakingAddress
}

export const getStakingAccount = async (
  userPubkey: PublicKey,
  connection: Connection
): Promise<UserStaking> => {
  return await UserStaking.fromAccountAddress(connection, getStakingAccountAddress(userPubkey))
}

export const getClnStakingInitInfo = async (
  connection: Connection
): Promise<ClnStakingInfo> => {
  const [clnStakingInfoAccount, __] = PublicKey.findProgramAddressSync(
    [Buffer.from("clone-staking")],
    CLONE_STAKING_PROGRAM_ID
  )
  return await ClnStakingInfo.fromAccountAddress(connection, clnStakingInfoAccount)
}

export const getCLNTokenBalance = async (
  userPubkey: PublicKey,
  connection: Connection
): Promise<{ isAccountInitialized: boolean; amount: number }> => {
  const clnTokenAccountAddress = getAssociatedTokenAddressSync(CLN_TOKEN_MINT, userPubkey, true)
  let isAccountInitialized = false
  let amount = 0
  try {
    const tokenAccount = await getAccount(connection, clnTokenAccountAddress, "confirmed")
    amount = Number(tokenAccount.amount)
    isAccountInitialized = true
  } catch { }
  return { isAccountInitialized, amount }
}

export const createDepositStakeIx = (
  userPubkey: PublicKey,
  amount: BN // Should be scaled.
): TransactionInstruction[] => {
  const { clnStakingAccountAddress, clnTokenVault } = getCloneStakingAccounts()
  const clnTokenAccountAddress = getAssociatedTokenAddressSync(CLN_TOKEN_MINT, userPubkey, true)

  let ixns: TransactionInstruction[] = []

  ixns.push(
    createAddStakeInstruction(
      {
        user: userPubkey,
        userAccount: getStakingAccountAddress(userPubkey),
        cloneStaking: clnStakingAccountAddress,
        clnTokenVault,
        clnTokenMint: CLN_TOKEN_MINT,
        userClnTokenAccount: clnTokenAccountAddress,
      },
      {
        amount,
      },
      CLONE_STAKING_PROGRAM_ID
    )
  )
  return ixns
}

export const createWithdrawStakeIx = (
  userPubkey: PublicKey,
  amount: BN, // Should be the scaled amount.
): TransactionInstruction[] => {
  const { clnStakingAccountAddress, clnTokenVault } = getCloneStakingAccounts()
  const clnTokenAccountAddress = getAssociatedTokenAddressSync(CLN_TOKEN_MINT, userPubkey, true)

  let ixns: TransactionInstruction[] = []

  ixns.push(
    createAssociatedTokenAccountIdempotentInstruction(
      userPubkey,
      clnTokenAccountAddress,
      userPubkey,
      CLN_TOKEN_MINT
    )
  )

  ixns.push(
    createWithdrawStakeInstruction(
      {
        user: userPubkey,
        userAccount: getStakingAccountAddress(userPubkey),
        cloneStaking: clnStakingAccountAddress,
        clnTokenVault,
        clnTokenMint: CLN_TOKEN_MINT,
        userClnTokenAccount: clnTokenAccountAddress,
      },
      {
        amount,
      },
      CLONE_STAKING_PROGRAM_ID
    )
  )
  return ixns
}
