const axios = require("axios")

const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY
const BSCSCAN_API_URL = process.env.BSCSCAN_API_URL

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

    console.log(`microservice ${i}-->> balance fetched -->> ${balance}`)
    return balance

}

module.exports = { fetchBalance }