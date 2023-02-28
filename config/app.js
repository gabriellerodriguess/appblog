import express from "express";
import { create } from 'express-handlebars'
import bodyParser from 'body-parser'
import router from "../routes/admin.js";
import path from 'path'
// import mongoose from "mongoose";

const app = express()
const hbs = create({})
const port = 8081
const __dirname = path.resolve();

//Config BodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


//Config Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', '../views');
app.use(express.static(path.join(__dirname, '/public')))


//Public

//Routes
app.use('/admin', router)

app.listen(port, () => {
    console.log('Server run.')
    console.log(__dirname, )
})