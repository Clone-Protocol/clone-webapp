import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const rpcCall = params.userAddress ? supabase.from(
    "user_tickets"
  ).select().eq('user_address', params.userAddress) : supabase.from(
    "user_tickets_total"
  ).select('total');

  let { data, error } = await rpcCall;

  let newData: any = data

  if (error !== null) {
    console.log(error)
    return { statusCode: 500, body: JSON.stringify(error) }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(newData),
    ////  NOTE: Uncomment this out after testing, otherwise it will cache.
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json',
    }
  }
}