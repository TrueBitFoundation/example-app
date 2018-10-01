const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/contracts', function (req, res) {
    res.send(JSON.stringify({foo: "bar"}))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
