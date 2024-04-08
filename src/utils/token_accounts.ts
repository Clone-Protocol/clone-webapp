import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  TokenAccountNotFoundError,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { CloneClient } from "clone-protocol-sdk/sdk/src/clone";

export const getTokenAccount = async (mint: PublicKey, owner: PublicKey, connection: Connection): Promise<{ address: PublicKey, isInitialized: boolean }> => {
  const associatedToken = await getAssociatedTokenAddress(
    mint,
    owner,
    true
  );

  let isInitialized = false;

  try {
    await getAccount(
      connection,
      associatedToken,
      "recent",
      TOKEN_PROGRAM_ID
    );
    isInitialized = true;
  } catch (error: unknown) {
    if (!(error instanceof TokenAccountNotFoundError)) {
      throw error;
    }
  }

  return { address: associatedToken, isInitialized };
}

export const getCollateralAccount = async (clone: CloneClient): Promise<{ address: PublicKey, isInitialized: boolean }> => {
  const collateralTokenAccount = await getTokenAccount(
    clone.clone!.collateral.mint,
    clone.provider.publicKey!,
    clone.provider.connection
  );
  return collateralTokenAccount;
}
