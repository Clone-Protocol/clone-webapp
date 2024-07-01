import { Handler } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"
import axios from "axios"
import { ed25519 } from "@noble/curves/ed25519"
import { PublicKey } from "@solana/web3.js"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"

export enum LinkDiscordAccessStatus {
  SUCCESS = 0,
  ADDRESS_ALREADY_LINKED = 1,
  INVALID_SIGNATURE = 2,
  UNKNOWN_ERROR = 3,
}

export const generateDiscordLinkMessage = (accessToken: string) => {
  return new TextEncoder().encode(
    `Please sign this message to link your discord account.\nAccess token: ${accessToken}`
  )
}

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const userAddress = params.userAddress!
  const signature = params.signature!
  const accessToken = params.accessToken!

  // Validate signature
  const message = generateDiscordLinkMessage(accessToken)
  const encodedSignature = new Uint8Array(bs58.decode(signature))
  const pubkey = new PublicKey(userAddress)
  const isSignatureValid = ed25519.verify(encodedSignature, message, pubkey.toBytes())

  if (!isSignatureValid) {
    return {
      statusCode: 200,
      body: JSON.stringify({ result: LinkDiscordAccessStatus.INVALID_SIGNATURE }),
    }
  }
  // Fetch discord ID and handle
  const userResponse = await axios.get("https://discordapp.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })

  const { id, username } = userResponse.data
  // Store signature in database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let result = LinkDiscordAccessStatus.SUCCESS
  let { error } = await supabase
    .from("discord_linked_addresses")
    .insert([{ address: userAddress, discordHandle: username, discordId: id }])

  if (error !== null) {
    if (error.code === "23505") {
      result = LinkDiscordAccessStatus.ADDRESS_ALREADY_LINKED
    } else {
      result = LinkDiscordAccessStatus.UNKNOWN_ERROR
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  }
}
