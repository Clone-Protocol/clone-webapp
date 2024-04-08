import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { CloneClient } from 'clone-protocol-sdk/sdk/src/clone'

export const shortenAddress = (address: string, limit: number = 10, chars: number = 5) => {
	if (address.length <= limit) return address
	return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export const getSolInBalance = async (program: CloneClient, publicKey: PublicKey) => {
	const connection = program.provider.connection
	const balance = await connection.getBalance(publicKey)
	const lamportBalance = (balance / LAMPORTS_PER_SOL)
	return lamportBalance
}