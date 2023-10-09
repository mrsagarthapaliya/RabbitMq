const express = require("express")
const amqp = require("amqplib/callback_api")
const port = 5001

const app = express();

app.get('/producer', (req, res) => {

    const balanceIds = [
        "0x29bDfbf7D27462a2d115748ace2bd71A2646946c",
        "0xdccF3B77dA55107280bd850ea519DF3705D1a75a",
        "0x3c783c21a0383057D128bae431894a5C19F9Cf06",
        "0x73f5ebe90f27B46ea12e5795d16C4b408B19cc6F",
        "0x161bA15A5f335c9f06BB5BbB0A9cE14076FBb645",
        "0xa180Fe01B906A1bE37BE6c534a3300785b20d947"
    ]

    amqp.connect('amqp://localhost', (err, conn) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        conn.createChannel((err, ch) => {
            if (err) {
                return res.send(err)
            }

            const queue = 'abcd'
            const msg = JSON.stringify(balanceIds)
            
            ch.assertQueue(queue, { durable: false })

            for (const id of balanceIds) {
                ch.sendToQueue(queue, Buffer.from(id), { persistent: true })

                console.log(`sent ${id} to ${queue}`)

            }

            res.send("Message from producer")
        })
    })
})

app.listen(port, () => {
    console.log("producer server started @ 5001")
})