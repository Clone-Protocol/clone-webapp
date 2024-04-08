import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'


export const handler: Handler = async (event, context) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  console.log('get-users-all-points')
  const rpcCall = supabase.from(
    "user_points_view_materialized"
  ).select().order('rank', { ascending: true }).limit(100);

  let { data, error } = await rpcCall;

  // console.log('data', data)

  if (error !== null) {
    console.log(error)
    return { statusCode: 500, body: JSON.stringify(error) }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json',
    }
  }
}
