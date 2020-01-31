console.log(new Date().toLocaleString(),'pauk defects register start')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config =  require('./config/config')
//const jwt = require('jsonwebtoken')
//const morgan = require('morgan')

const app = express()

//app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use('/defects_images',express.static('defects_images'))
//app.use(jwt)

require('./routes')(app)

app.listen(config.port)
console.log(new Date().toLocaleString(),`Server started on port ${config.port}`, '')