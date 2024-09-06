const express = require("express")
const app = express()
const bodyParser = require("body-parser")
require("dotenv/config")

const api = process.env.API_URL

app.use(bodyParser.json())

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: "Product one",
    image: "Fake url"
  }
  res.send(product)
})

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body
  console.log(newProduct)
  res.send(newProduct)
})

app.listen(3000, () => {
  console.log("Server is runnin on port 3000")
})