import { Handler } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"
import axios from "axios"
import { PublicKey } from "@solana/web3.js"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import { Transaction } from "@solana/web3.js"
import { LinkDiscordAccessStatus } from "functions/link-discord-access/link-discord-access"

export const generateDiscordLinkRawMessage = (accessToken: string) => {
  return `Please sign this message to link your discord account.\nAccess token: ${accessToken}`
}

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const userAddress = params.userAddress!
  const signature = params.signature!
  const accessToken = params.accessToken!

  const message = generateDiscordLinkRawMessage(accessToken)
  const encodedSignature = new Uint8Array(bs58.decode(signature))

  // Validate signature
  const signedTx = Transaction.from(encodedSignature);
  const inx = signedTx.instructions[2];

  let isSignatureValid = true
  if (!inx.programId.equals(new PublicKey(process.env.NEXT_PUBLIC_CLONE_PROGRAM_ID!))) isSignatureValid = false
  if (inx.data.toString() != message) isSignatureValid = false
  if (!signedTx.verifySignatures()) isSignatureValid = false

  console.log('inx', inx)

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
  console.log('r', result)

  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  }
}
