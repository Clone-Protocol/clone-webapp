import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const rpcCall = supabase.from(
    "arbitrage_info"
  ).select().limit(100);

  let { data, error } = await rpcCall;

  let newData: any = data?.map((item, index) => ({
    id: index,
    ...item
  }))

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