import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const userAddress = params.userAddress

  let successful = false;

  const { data: data2, error: error2 } = await supabase.from(
    "linked_referral_codes"
  ).select("referral_code").eq("user_address", userAddress);


  //non-referred
  if (error2 || (data2?.length === 0)) {

    const { data, error } = await supabase.from(
      "user_points_view_materialized"
    ).select().eq('user_address', userAddress).gt("total_points", 0).gt("lp_points", 0)

    // no-point user
    if (error || data?.length === 0) {
      console.log('success')
      successful = true;
    } else {
      console.log('already has point')
    }
  } else {
    console.log('already referred')
  }

  // If successfully generated or fetched, cache indefinitely
  const headers = undefined;

  return {
    statusCode: 200,
    body: JSON.stringify({
      successful
    }),
    headers
  }
}