import { mintUSDi, priorityFee } from '~/features/globalAtom'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react'
import { useClone } from './useClone';
import { useAtom, useAtomValue } from 'jotai'
import { PublicKey } from '@solana/web3.js'
import { toScale } from 'clone-protocol-sdk/sdk/src/clone'
import { sendAndConfirm } from '~/utils/tx_helper'
import { useTransactionState } from './useTransactionState';
import { createMintAssetInstruction } from 'clone-protocol-sdk/sdk/generated/mock-asset-faucet'
import { getOrCreateAssociatedTokenAccount } from 'clone-protocol-sdk/sdk/src/utils';

export default function useFaucet() {
  const { connected, publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { getCloneApp } = useClone()
  const [mintUsdi, setMintUsdi] = useAtom(mintUSDi)
  const payerFee = useAtomValue(priorityFee)
  const { setTxState } = useTransactionState()
  const MOCK_FAUCET_PROGRAM_ID = process.env.NEXT_PUBLIC_MOCK_FAUCET_PROGRAM_ID!

  useEffect(() => {
    async function userMintOnusd() {
      const onusdToMint = 100;
      if (connected && publicKey && mintUsdi && wallet) {
        const program = await getCloneApp(wallet)

        const [faucetAddress] = PublicKey.findProgramAddressSync(
          [Buffer.from("faucet")],
          new PublicKey(MOCK_FAUCET_PROGRAM_ID)
        );

        const usdcAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
          program.provider,
          program.clone.collateral.mint
        );

        let ixnCalls = []
        try {
          ixnCalls.push(
            await createMintAssetInstruction({
              minter: publicKey,
              faucet: faucetAddress,
              mint: program.clone.collateral.mint,
              tokenAccount: usdcAssociatedTokenAccount.address,
            }, { amount: toScale(onusdToMint, program.clone.collateral.scale) })
          )

          let ixns = await Promise.all(ixnCalls)
          await sendAndConfirm(program.provider, ixns, setTxState, payerFee)
        } finally {
          setMintUsdi(false)
        }
      }
    }
    userMintOnusd()
  }, [mintUsdi, connected, publicKey])
}
