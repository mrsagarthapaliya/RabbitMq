const axios = require("axios")

const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || "JVAWPEJIP8PGE63B54YHPX8G93FJ768F6J"
const BSCSCAN_API_URL = process.env.BSCSCAN_API_URL || "https://api.bscscan.com/api"

const fetchBalance = async (balanceId) => {
    const response = await axios.get(
        BSCSCAN_API_URL,
        {
            params: {
                module: "account",
                action: "balance",
                address: balanceId,
                apiKey: BSCSCAN_API_KEY
            }
        }
    );

    const balance = response.data.result

    console.log(`balance fetched -->> ${balance}`)
    return balance

}

const balanceIds = [
    "0x29bDfbf7D27462a2d115748ace2bd71A2646946c",
    "0xdccF3B77dA55107280bd850ea519DF3705D1a75a",
    "0x3c783c21a0383057D128bae431894a5C19F9Cf06",
    "0x73f5ebe90f27B46ea12e5795d16C4b408B19cc6F",
    "0x161bA15A5f335c9f06BB5BbB0A9cE14076FBb645",
    "0xa180Fe01B906A1bE37BE6c534a3300785b20d947"
]

const runTask = async () => {

    console.time('nonQueueExecutionTime')
    await Promise.all(balanceIds.map((id) => fetchBalance(id)))
    console.log()
    console.timeEnd('nonQueueExecutionTime')
}

runTask()