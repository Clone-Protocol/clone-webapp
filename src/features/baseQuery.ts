import { Clone as CloneAccount, Pools } from 'clone-protocol-sdk/sdk/generated/clone'
import { PublicKey, Connection, Commitment } from "@solana/web3.js";
import fetchRetry from "fetch-retry";
import fetch from "cross-fetch";
import { AnchorProvider } from "@coral-xyz/anchor";
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'
import { AnchorWallet } from '@solana/wallet-adapter-react';

export const funcNoWallet = async () => {
  console.log('no wallet')
  return {
    result: false
  }
}

export const getCloneClient = async (networkEndpoint: string, wallet?: AnchorWallet) => {
  const fetchWithRetry = fetchRetry(fetch, {
    retries: 3,
    retryDelay: 100,
  }) as any;

  const connection = new Connection(networkEndpoint, {
    commitment: 'confirmed',
    fetch: fetchWithRetry,
  })

  let provider
  if (wallet) {
    const opts = {
      preflightCommitment: "confirmed" as Commitment,
    }
    provider = new AnchorProvider(connection, wallet, opts)
  } else {
    // MEMO: to support provider without wallet adapter
    provider = new AnchorProvider(
      connection,
      {
        signTransaction: () => Promise.reject(),
        signAllTransactions: () => Promise.reject(),
        publicKey: PublicKey.default, // MEMO: dummy pubkey
      },
      {}
    );
  }

  const programId = new PublicKey(process.env.NEXT_PUBLIC_CLONE_PROGRAM_ID!);
  const [cloneAccountAddress, _] = PublicKey.findProgramAddressSync(
    [Buffer.from("clone")],
    programId
  );
  const cloneAccount = await CloneAccount.fromAccountAddress(
    provider.connection,
    cloneAccountAddress
  );

  const program = new CloneClient(provider, cloneAccount, programId)

  //@TEST
  // if (wallet) {
  //   const subscriptionId = connection.onAccountChange(
  //     program.getPoolsAddress(),
  //     async (updatedAccountInfo, context) => {
  //       console.log("Updated account info: ", updatedAccountInfo)
  //       const pools = await Pools.fromAccountInfo(updatedAccountInfo, 0)[0]
  //       // set pools to jotai global state

  //       // console.log(pools)
  //     },
  //     "confirmed"
  //   )
  //   console.log('Starting web socket, subscription ID: ', subscriptionId);

  //   // await connection.removeAccountChangeListener(subscriptionId);
  // }


  return {
    cloneClient: program,
    connection,
  }
}