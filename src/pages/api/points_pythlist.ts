import type { NextApiRequest, NextApiResponse } from 'next'

export type PythObj = {
  address: string
  tier: number
}
export type PythResponseData = {
  result: PythObj[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PythResponseData>
) {
  // const dirRelativeToPublicFolder = 'data'
  // const dir = path.resolve('./public', dirRelativeToPublicFolder);
  // const fileContents = await fs.readFile(dir + '/pythSnapshot.json', 'utf8');
  const fetchData = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/data/pythSnapshot.json`)
  const fileContents = await fetchData.json()
  res.status(200).json({ result: fileContents });
}

export const config = {
  api: {
    responseLimit: false,
  },
}