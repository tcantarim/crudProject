const express = require("express")
const cors    = require("cors")
const dotenv  = require("dotenv/config.js")

const app = express()

app.use(cors({origin: "*", methods: "*"}))
app.use(express.json())
app.use(express.urlencoded( {extended:true} ))

require("./database/connect.js")()
require("./src/routes/clientsRouter.js")(app)

const PORT = process.env.SERVICE_PORT

app.listen(PORT, () => console.log(`[SERVICE] Listening on port ${PORT}!`))