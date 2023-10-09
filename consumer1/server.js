const axios = require("axios")
const amqp = require("amqplib/callback_api")
const port = 5000

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

    console.log(`${balance} with timestamp ${new Date().getTime()}`)
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

        const queue = 'balanceQueue'
        const queue1 = 'anotherQueue'

        console.log(`Waiting for the msg from ${queue} and ${queue1}`)
        ch.assertQueue(queue, { durable: false })
        ch.consume(queue, async (msg) => {
            const balanceIds = JSON.parse(msg.content.toString())
            const balances = await Promise.all(
                balanceIds.map((balanceId) => fetchBalance(balanceId))
            )
        }, { noAck: true })
        ch.assertQueue(queue, { durable: false })
        ch.consume(queue1, async (msg1) => {
            const balanceIds = JSON.parse(msg1.content.toString())
            const balances = await Promise.all(
                balanceIds.map((balanceId) => fetchBalance(balanceId))
            )
        }, { noAck: true })

    })
})
console.timeEnd('programExecution')

