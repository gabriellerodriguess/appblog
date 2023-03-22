import express from "express"
import { create } from 'express-handlebars'
import bodyParser from 'body-parser'
import router from "../routes/admin.js"
import path from 'path'
import mongoose from "mongoose"
import session from 'express-session'
import flash from 'connect-flash'

const app = express()
const hbs = create({})
const port = 8081
const __dirname = path.resolve()

//Config BodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Config Mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/appblog', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('Server mongo init')
}).catch((error) => {
    console.log(`Fail connected mongo server ${error}`)
})

//Config Handlebars
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', '../views');

//Config files css/js/img
app.use(express.static(path.join(__dirname, '/public')))

//Config Session
app.use(session({
    secret: 'blogapp',
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

//Routes
app.use('/admin', router)


//Config Middleware
app.use((req,res,next) => {
    //variáveis globais
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')

    next()
})

app.listen(port, () => {
    console.log('Server run.')
    console.log(__dirname, )
})