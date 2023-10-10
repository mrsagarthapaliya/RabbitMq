const axios = require("axios")

const BSCSCAN_API_KEY = "JVAWPEJIP8PGE63B54YHPX8G93FJ768F6J"
const BSCSCAN_API_URL = "https://api.bscscan.com/api"

const fetchBalance = async (balanceId, i) => {
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

    console.log(`microservice ${i}-->> balance fetched`)
    return balance

}

module.exports = { fetchBalance }