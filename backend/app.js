const dontenv=require('dotenv')
dontenv.config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/user.routes.js')
const memesRoutes = require('./routes/meme.routes.js')
const aiRoutes = require('./routes/ai.routes.js')
const morgan = require('morgan')

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/user',userRoutes)
app.use('/memes',memesRoutes)
app.use('/ai',aiRoutes)

app.get('*', (req, res) => {
    res.send('Hello User! Check you URL')
}
)


module.exports = app