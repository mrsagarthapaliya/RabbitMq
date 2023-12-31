const express = require("express")
const amqp = require("amqplib/callback_api")
const port = 5001

const app = express();

app.get('/producer', (req, res) => {

    // adding crypto wallet addressses
    const balanceIds = [
        "0x29bDfbf7D27462a2d115748ace2bd71A2646946c",
        "0xdccF3B77dA55107280bd850ea519DF3705D1a75a",
        "0x3c783c21a0383057D128bae431894a5C19F9Cf06",
        "0x73f5ebe90f27B46ea12e5795d16C4b408B19cc6F",
        "0x161bA15A5f335c9f06BB5BbB0A9cE14076FBb645",
        "0xa180Fe01B906A1bE37BE6c534a3300785b20d947"
    ]

    //starting with the connection by producer
    amqp.connect('amqp://localhost', (err0, conn) => {

        if (err0) {
            console.log(err0)
            return res.send(err0)
        }

        //channel creation by producer
        conn.createChannel((err1, ch) => {
            if (err1) {
                console.log(err1)
                return res.send(err1)
            }

            const queue = 'msg' //name of the queue -- use same name for both producer and consumer

            ch.assertQueue(queue, { durable: true }) // Durable (the queue will survive a broker restart)

            //sending messages to the queue in a loop
            for (const id of balanceIds) {
                const mg = JSON.stringify(id)
                ch.sendToQueue(queue, Buffer.from(mg), { persistent: true })

                console.log(`sent ${mg} to ${queue}`)
            }
            res.send({
                message: "Message from producer",
                data: balanceIds
            })
        })
    })
})

app.listen(port, () => {
    console.log("producer server started @ 5001\n")
})