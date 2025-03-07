const app= require('./app')
const dotenv = require('dotenv')
dotenv.config()
const http = require('http')
const connectDB = require('./database/db')

const PORT = process.env.PORT || 3001

const server = http.createServer(app)

connectDB()

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})