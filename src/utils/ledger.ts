import {
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js";

export const buildAuthTx = async (nonce: string): Promise<Transaction> => {
  const tx = new Transaction();

  tx.add(
    new TransactionInstruction({
      programId: new PublicKey(process.env.NEXT_PUBLIC_CLONE_PROGRAM_ID!),
      keys: [],
      data: Buffer.from(nonce, "utf8"),
    })
  );
  return tx;
};