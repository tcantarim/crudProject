const mongoose = require("mongoose")
const bcrypt   = require("bcrypt")

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    age: {
        type: Number,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

ClientSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10)

    this.password = hash
})

const Clients = mongoose.model("Clients", ClientSchema)

module.exports = Clients 