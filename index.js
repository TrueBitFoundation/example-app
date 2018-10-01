const express = require('express')
const app = express()
const port = 3000

const fs = require('fs')

app.use(express.static('public'))

app.get('/contracts', function (req, res) {
    let artifacts = fs.readFileSync(__dirname + "/truebit-os/wasm-client/" + req.query.network + ".json")
    res.send(artifacts)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
