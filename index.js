const redis = require('redis')
const app = require('express')()
const faker = require('faker')
const client = redis.createClient(6379, 'mredis')

client.monitor(function (err, res) {
    console.log("Entering monitoring mode.");
});
client.on("error", function (err) {
    console.log("Error" + err);
});

client.on("connect", function (err) {
    client.flushall()
    console.log('deleted all of them')
    initRandomData()
});

app.get('/', (req, res) => {
    let key = Math.random(0, 1).toFixed(3) * 1000

    client.set('key', key)
    client.get('key', (err, reply) => {
        log(reply, err)

        if (key == reply) {
            console.log('same')
        } else {
            console.log('different')
        }
        res.json({
            status: true,
            key: reply
        })
    })
})

app.get('/empty', (req, res) => {
    client.get('empty', (err, reply) => {
        log(reply, err)
        send(res, reply, err)
    })
})
app.get('/setifempty', (req, res) => {
    client.get('setifempty', (err, reply) => {
        if (reply === null) {
            console.log('setifempty key setted')
            client.set('setifempty', 'random')
        }
        log(reply, err)
        send(res, reply, err)
    })
})

app.listen(8001, () => {
    console.log('server started')
})








const log = (reply, err) => {
    console.log(`LOG > reply: ${reply} err: ${err}`)
}
const send = (res, reply, err) => {
    res.json({
        reply, err
    })
}

const initRandomData = () => {
    for (let i = 0; i < 10; i++) {
        let user = [`user-${i}`,
            'username', faker.internet.userName(),
            'displayname', faker.name.findName(),
            'email', faker.internet.email(),
            'ip', faker.internet.ip(),
            'color', faker.internet.color()
        ]
        //hmset has no expire option
        client.hmset(user, redis.print)
    }

    client.hgetall('user-0', (err, reply) => {
        console.log('user-0', reply)
    })

}