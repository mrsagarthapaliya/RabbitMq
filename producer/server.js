const express = require("express")
const amqp = require("amqplib/callback_api")
const port = 5001

const app = express();

app.get('/producer', (req, res) => {

    const balanceIds = [
        "0x29bDfbf7D27462a2d115748ace2bd71A2646946c",
        "0xdccF3B77dA55107280bd850ea519DF3705D1a75a",
        "0x3c783c21a0383057D128bae431894a5C19F9Cf06",
    ]

    const balanceIdss = [
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

            const queue = 'balanceQueue'
            const queue1 = 'anotherQueue'
            const msg = JSON.stringify(balanceIds)
            const msg1 = JSON.stringify(balanceIdss)

            ch.assertQueue(queue, { durable: false })
            ch.sendToQueue(queue, Buffer.from(msg))

            ch.assertQueue(queue1, { durable: false })
            ch.sendToQueue(queue1, Buffer.from(msg1))

            console.log(`sent ${ msg } to ${ queue }\n and ${ msg1 }\n to ${ queue1 }`)
            res.send("Message from producer")
        })
    })
})

app.listen(port, () => {
    console.log("producer server started @ 5001")
})