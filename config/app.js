import express from "express"
import { create } from 'express-handlebars'
import bodyParser from 'body-parser'
import router from "../routes/admin.js"
import path from 'path'
import mongoose from "mongoose"
import session from 'express-session'
import flash from 'connect-flash'
import modelPosts from "../models/Post.js"
import modelCategory from "../models/Category.js"

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

app.get('/', (req,res) => {
    modelPosts.find().lean().populate('category').sort({date:'desc'}).then((posts) => {
        res.render('index', ({posts: posts}))
    }).catch((req,res) => {
       console.log('error_msg', 'Ocurred a intern error. Try again.')
       res.redirect('/404')
    })
})

app.get('/posts/:slug', (req,res) => {
    modelPosts.findOne({slug: req.params.slug}).lean().then((post) => {
        if(post) {
            console.log(post)
            res.render('post/index', ({post: post}))
        } else {
            res.redirect('/')
        }
    }).catch((error => {
        console.log(error)
        res.redirect('/')
    }))
})

app.get('/categories', (req,res) => {
    modelCategory.find().lean().then((categories) => {
        console.log(categories)
        res.render('categories/index', ({categories: categories}))
    }).catch((error) => {
        console.log(`An error occurred. ${error}`)
    })
})

app.get('/categories/:slug', (req, res) => {
    modelCategory.findOne({slug: req.params.slug}).lean().then((category) => {
        if(category) {
            modelPosts.find({category: category._id}).populate('category').lean().then((posts) => {
                res.render('categories/posts', ({posts: posts, category: category}))
            }).catch((error) => {
                console.log(`An error occurred when category listed. ${error}`)
                res.redirect('/')
            })
        }
    })
})

app.get('/404', (req,res) => {
    res.send('Ocurred a intern error. Try again.')
})

app.listen(port, () => {
    console.log('Server run.')
    console.log(__dirname, )
})