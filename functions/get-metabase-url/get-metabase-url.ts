import { Handler } from '@netlify/functions'
import jwt from 'jsonwebtoken'

export const handler: Handler = async (event, context) => {
  const METABASE_SITE_URL = process.env.NEXT_METABASE_SITE_URL;
  const METABASE_SECRET_KEY = process.env.NEXT_METABASE_SECRET_KEY;
  const payload = {
    resource: { question: 176 },
    params: {},
    exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
  };
  const token = jwt.sign(payload, METABASE_SECRET_KEY!);
  const iframeUrl = METABASE_SITE_URL + "/embed/question/" + token +
    "#bordered=true&titled=true&theme=night";

  const data = {
    url: iframeUrl
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  }
}
