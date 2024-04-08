import { Handler } from '@netlify/functions'
import axios from 'axios'


export const handler: Handler = async () => {
    const cloneProgramId = process.env.NEXT_PUBLIC_CLONE_PROGRAM_ID!;
    const HELIUS_RPC = process.env.NEXT_PUBLIC_NETWORK_ENDPOINT_HELIUS!;

    const request = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "getPriorityFeeEstimate",
        "params": [{
            "accountKeys": [cloneProgramId],
            "options": {
                "includeAllPriorityFeeLevels": true
            }
        }]
    }
    try {
        const response = await axios.post(HELIUS_RPC, request)
        return {
            statusCode: 200,
            body: JSON.stringify(response.data.result),
        }
    } catch (error) {
        console.error("Error fetching priority fee estimate:", error)
        return { statusCode: 500 }
    }
}
