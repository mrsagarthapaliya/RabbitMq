const axios = require("axios")
const amqp = require("amqplib/callback_api")

console.time('programExecution')

const BSCSCAN_API_KEY = "JVAWPEJIP8PGE63B54YHPX8G93FJ768F6J"
const BSCSCAN_API_URL = "https://api.bscscan.com/api"

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

    console.log(`${balanceId}-->>${balance}`)
    return balance

}

amqp.connect('amqp://localhost', (err, conn) => {
    if (err) {
        return res.send(err)
    }

    conn.createChannel((err, ch) => {
        if (err) {
            return res.send(err)
        }

        const queue = 'bQueue'

        console.log(`Waiting for the msg from ${queue}`)
        ch.assertQueue(queue, { durable: true })
        ch.consume(queue, async (msg) => {
            const balanceIds = JSON.parse(msg.content.toString())
            await Promise.all(
                balanceIds.map((balanceId) => fetchBalance(balanceId))
            )
        }, { noAck: false })
    })
})
console.timeEnd('programExecution')

