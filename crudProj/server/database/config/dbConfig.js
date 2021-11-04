const process = require("process")

module.exports = {
    url: `mongodb://localhost:27017/${process.env.DB_NAME}`,
    options: {
        useCreateIndex: true, 
        useFindAndModify: false, 
        useUnifiedTopology: true, 
        useNewUrlParser: true
    }
}