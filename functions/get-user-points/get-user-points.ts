import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { PythObj } from '~/pages/api/points_pythlist';

export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const rpcCall = params.userAddress ? supabase.from(
    "user_points_view_materialized"
  ).select().eq('user_address', params.userAddress) : supabase.from(
    "user_points_view_materialized"
  ).select().order('rank', { ascending: true });

  let { data, error } = await rpcCall;
  console.log('d', data)

  let newData: any = data

  //check if the address is included in pythResult
  if (params.userAddress) {
    try {
      console.log('p', params.userAddress)
      //pyth points
      // const dirRelativeToPublicFolder = 'data'
      // const dir = path.resolve('./public', dirRelativeToPublicFolder);
      // const fileContents = await fs.readFile(dir + '/pythSnapshot.json', 'utf8');
      const fetchData = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/data/pythSnapshot.json`)
      const fileContents = await fetchData.json()
      const pythResult: PythObj[] = fileContents

      const pythUser = pythResult.find((pythUser) => {
        return pythUser.address === params.userAddress
      })
      newData[0].hasPythPoint = pythUser !== undefined ? true : false
      newData[0].pythPointTier = pythUser !== undefined ? pythUser.tier : -1
      console.log('new', newData)
    } catch (error) {
      console.error('e', error)
    }
  }

  if (error !== null) {
    console.log(error)
    return { statusCode: 500, body: JSON.stringify(error) }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(newData),
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json',
    }
  }
}
