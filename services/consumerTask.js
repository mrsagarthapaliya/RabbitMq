const amqp = require("amqplib/callback_api")

const { fetchBalance } = require("./fetchBalance")

const consumerTask = () => {
    amqp.connect('amqp://localhost', (err, conn) => {
        if (err) {
            return res.send(err)
        }

        conn.createChannel((err, ch) => {
            if (err) {
                return res.send(err)
            }

            const queue = 'abcd'

            console.log(`Waiting for the msg from ${queue}`)
            ch.assertQueue(queue, { durable: false })
            ch.prefetch(1)
            ch.consume(queue, async (msg) => {
                const balanceIds = JSON.parse(msg.content.toString())
                await Promise.all(
                    balanceIds.map((balanceId) => fetchBalance(balanceId))
                )
                ch.ack(msg)
            }, { noAck: false })
        })
    })
}

module.exports = { consumerTask }