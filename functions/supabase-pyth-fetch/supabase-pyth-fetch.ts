import { createClient } from '@supabase/supabase-js'
import { Handler } from '@netlify/functions'
import { IS_DEV } from '~/data/networks'

export const handler: Handler = async (event, context) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  try {
    const { data, error } = await supabase
      .from('notices')
      .select()
      .eq('channel', 'liquidity-pyth')
      .eq('show', true)

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: ''
    }
  }
}
