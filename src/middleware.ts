import { NextRequest, NextResponse } from 'next/server'
// import { WHITELIST_ADDRESSES } from './utils/whitelist_addresses'

export async function middleware(req: NextRequest) {
  const { nextUrl: url, geo } = req

  const BLOCKED_COUNTRY_CODE_ARRAY = [
    'AF', 'AS', 'AO', 'AM', 'AZ', 'BY', 'BA', 'BW', 'BI', 'KH', 'CM', 'CA', 'CF', 'TD', 'CN', 'KP', 'CD', 'ER', 'ET', 'GH', 'GU', 'GN', 'GW', 'HT', 'IR', 'IQ', 'LA', 'LB', 'LR', 'LY', 'MG', 'ML', 'MZ', 'MM', 'NI', 'MP', 'PK', 'PR', 'CG', 'RU', 'SO', 'SD', 'UA', 'LK', 'SY', 'TJ', 'TT', 'TM', 'UG', 'US', 'UZ', 'VU', 'VE', 'VI', 'YE', 'ZW'
  ]

  console.log('geo', geo?.country)

  // url.searchParams.set('country', geo?.country)

  if (geo && BLOCKED_COUNTRY_CODE_ARRAY.includes(geo.country!)) {
    return NextResponse.json({
      result: false
    })
  } else {

    // Hardcoded whitelist address
    // const whitelistAddr = WHITELIST_ADDRESSES

    return NextResponse.json({
      result: true,
      // whitelistAddr
    })
  }
}

export const config = {
  // matcher: '/api/:path*',
  matcher: '/api/route',
}