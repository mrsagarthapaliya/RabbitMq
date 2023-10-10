const amqp = require("amqplib/callback_api")

const { fetchBalance } = require("../services/fetchBalance")

const consumerTask = (i) => {

    amqp.connect('amqp://localhost', (err0, conn) => {
        if (err0) {
            console.log(err0)
        }

        conn.createChannel((err1, ch) => {
            if (err1) {
                console.log(err1)
            }

            const queue = 'msg'

            console.log(`Waiting for the msg from ${queue}`)
            ch.assertQueue(queue, { durable: true })
            ch.prefetch(1)
            ch.consume(queue, async (msg) => {
                const balanceIds = JSON.parse(msg.content.toString())

                fetchBalance(balanceIds, i)

                ch.ack(msg)
            }, { noAck: false })
        })
    })
}

module.exports = { consumerTask }