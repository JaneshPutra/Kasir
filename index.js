const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const kasirroute = require("./kasir")
const menuroute = require("./menu")
const pelangganroute = require("./pelanggan")
const pembelianroute = require("./pembelian")

// implementasi
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(kasirroute)
app.use(menuroute)
app.use(pelangganroute)
app.use(pembelianroute)

app.listen(3000, () => {
    console.log("Run on port 8000")
})  