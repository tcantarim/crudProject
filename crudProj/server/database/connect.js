const mongoose = require("mongoose")
const dbConfig = require("./config/dbConfig.js")

const connectDB = async () => {
    const connectionDb = await mongoose.connect(dbConfig.url, dbConfig.options)

    console.log(`[MONGODB] Connected on port ${connectionDb.connection.port}`)
}

module.exports = connectDB