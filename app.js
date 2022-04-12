const express = require('express')
const dotenv = require('dotenv')
//const cookieParser = require('cookie-parser')

const app = express()


//para procesar datos enviados desde formularios
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//seteamos las varaibles de entorno
dotenv.config({path: './env/.env'})

//seteamos las cookies
//app.use(cookieParser())


//llmar al router 
app.use('/', require('./routes/router'))

app.listen(3000, ()=>{
    console.log('listening on port 3000')
})