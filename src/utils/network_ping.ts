import axios from "axios";

const measurePing = async (rpcUrl: string): Promise<{ ping: number, error?: any }> => {
  const requestData = {
    jsonrpc: "2.0",
    id: 1,
    method: "getHealth",
    params: []
  };

  try {
    const startTime = new Date().getTime();
    await axios.post(rpcUrl, requestData);
    const endTime = new Date().getTime();
    return { ping: endTime - startTime };
  } catch (error) {
    console.error('Error during RPC call:', error);
    return { ping: -1, error };
  }
};

export const measureRPCPings = async (rpcUrls: string[]): Promise<(number | undefined)[]> => {
  // Returns the RPC ping times in milliseconds
  const pingPromises = rpcUrls.map(measurePing);
  return (await Promise.allSettled(pingPromises)).map((result) => {
    if (result.status === "fulfilled") {
      // console.log("result:", result.value)
      return result.value.ping;
    } else {
      undefined
    }
  });
}