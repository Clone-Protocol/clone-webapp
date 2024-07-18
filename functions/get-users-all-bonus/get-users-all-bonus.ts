import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'


export const handler: Handler = async (event, context) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  console.log('get-users-all-bonus')
  const rpcCall = supabase.from(
    "pyth_stakers_top_100_cloners"
  ).select().lte('rank', 100);

  let { data, error } = await rpcCall;
  // console.log('data', data)

  const rpcCall2 = supabase.from(
    "jup_stakers_top_100_cloners"
  ).select().lte('rank', 100);

  let { data: data2 } = await rpcCall2;
  // console.log('data2', data2)

  const rpcCall3 = supabase.from(
    "drift_stakers_top_100_cloners"
  ).select().lte('rank', 100);
  let { data: data3 } = await rpcCall3;

  if (error !== null) {
    console.log(error)
    return { statusCode: 500, body: JSON.stringify(error) }
  }

  const resultObj = {
    pyth: data,
    jup: data2,
    drift: data3
  }

  return {
    statusCode: 200,
    body: JSON.stringify(resultObj),
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json',
    }
  }
}
