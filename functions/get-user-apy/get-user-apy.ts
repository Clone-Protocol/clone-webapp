import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  let projectedApy = await supabase.rpc('get_24hr_projected_apy', { user_addr: params.user_address });
  let avgCollateral = await supabase.rpc('get_24hr_time_weighted_average_collateral', { user_addr: params.user_address })
  if (projectedApy.error !== null) {
    console.log(projectedApy.error)
    return { statusCode: 500, body: JSON.stringify(projectedApy.error)}
  }

  if (avgCollateral.error !== null) {
    console.log(avgCollateral.error)
    return { statusCode: 500, body: JSON.stringify(avgCollateral.error)}
  }
  let poolApys: number[] = [];

  if (params.pool_indexes !== undefined) {
    poolApys = await Promise.all(params.pool_indexes.split(',').map(async (pool_index) => {
      const { data, error } = await supabase.rpc('get_pool_fees_past_24hrs', { user_addr: params.user_address, pool_idx: pool_index });
      return 100 * 365.25 * data / avgCollateral.data ;
    }))
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      apy: projectedApy.data,
      avgCollateral: avgCollateral.data,
      poolApy: poolApys
    }),
    headers: {
      'Cache-Control': 'public, max-age=60',
      'Content-Type': 'application/json',
      'Netlify-Vary': 'query'
    }
  }
}
