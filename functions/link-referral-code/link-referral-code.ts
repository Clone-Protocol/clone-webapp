import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// If userAddress is passed into the params it will return the users tickets,
// otherwise returns the total number of tickets.
export const handler: Handler = async (event, context) => {
  const params = event.queryStringParameters!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const userAddress = params.userAddress
  const referralCode = params.referralCode
  // status codes:
  // 0 - referral successful,
  // 1 - not eligible (they already have points),
  // 2 - already used a referral code, 
  // 3 - invalid referral code (doesn't exist yet),
  // 4 - unknown error
  let status = 4

  // If we find this user in this query, they're not eligible to link to a referrer.
  let { data, error } = await supabase.from(
    "user_points_view_materialized"
  ).select().eq('user_address', userAddress).gt("total_points", 0).gt("lp_points", 0)

  console.log("user_points_view request", data, error)

  if (error === null && data) {
    if (data?.length > 0) {
      // Not eligible
      status = 1;
    } else {
      // Attempt to insert into the linked referral table
      // This insert will fail if they already have a referral code
      let { error } = await supabase.from(
        "linked_referral_codes"
      ).insert([{ "user_address": userAddress, "referral_code": referralCode }]);

      console.log("linked referral codes error:", error)

      if (error === null) {
        // Successful
        status = 0;
      } else {
        // Figure out whats wrong.
        const code = error.code
        if (code === '23505') {
          status = 2
        } else if (code === '23503') {
          status = 3
        } else {
          // Unseen error...
          status = 4;
        }
      }
    }
  }

  console.log("status", status);

  // Only time this status will persist for a user
  // is when they already used a code, or aren't eligible
  const header = status === 1 || status === 2 ? {
    'Cache-Control': 'public, max-age=315360000',
    'Content-Type': 'application/json',
    'Netlify-Vary': 'query=userAddress'
  } : undefined;

  return {
    statusCode: 200,
    body: JSON.stringify({ status }),
    header
  }
}