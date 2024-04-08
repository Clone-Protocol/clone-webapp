import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const currentTimestamp = Math.floor((new Date()).getTime() / 1000)
  const [from, filterDaily] = (() => {
      switch (params.range) {
          case "1H":
              return [currentTimestamp - 3600, false]
          case "1D":
              return [currentTimestamp - 86400, false]
          case "1W":
              return [currentTimestamp - 7 * 86400, false]
          case "1M":
              return [currentTimestamp - 30 * 86400, true]
          case "1Y":
              return [currentTimestamp - 365 * 86400, true]
          default:
              throw new Error(`Unknown range: ${params.range}`)
      }
  })()

  let { data, error } = await (async () => {
    if (filterDaily) {
      return await supabase.from(
        "pyth-historical-hourly"
      ).select()
        .eq('symbol', params.symbol)
        .eq("dailyClose", true)
        .gt('timestamp', from)
        .order('timestamp', { ascending: true })
    } else {
      return await supabase.from(
        "pyth-historical-hourly"
      ).select()
        .eq('symbol', params.symbol)
        .gt('timestamp', from)
        .order('timestamp', { ascending: true })
    }
  })()
  let result: { timestamp: string, price: number }[] = []
  let statusCode = 500

  if (error === null && data !== null) {
    statusCode = 200
    for (const item of data) {
      result.push({
        timestamp: (new Date(item.timestamp * 1000)).toISOString(),
        price: Number(item.price)
      })
    }
  } else {
    console.log(error)
  }

  return {
    statusCode,
    body: JSON.stringify(result),
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json',
    }
  }
}
