if(process.env.NODE_ENV != "production"){
	require('dotenv').config()
}

console.log(process.env.APIKEY)

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const esjMate = require('ejs-mate')
var methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const session = require('express-session')
const flash = require('connect-flash')

const ExpressError = require('./utils/ExpressError')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campground')
const reviewRoutes = require('./routes/reviews')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
	console.log("Database Connected.")
})


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', esjMate)

const sessionConfig = {
	secret: 'thisshouldbeasecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000*60*60*24*7,
		maxAge: 1000*60*60*24*7,

	}
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
	console.log(req.session)
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next()
})


app.get('/fakeuser', async(req, res) => {
	const user = new User({email: "ashish@gm.co", username: "Colt"})
	const newUser = await User.register(user, 'chicken')
	res.send(newUser)
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.use('/', userRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/campgrounds', campgroundRoutes)



var myLogger = (req, res, next) => {
	// console.log(`Request = ${req.params.temp}`)
	// console.log(`Response = ${res}`)
	console.log("LOGGED IN.")
	next()
}
app.use(myLogger)

app.get('/', (req, res) => {
	res.render('home')
})



app.all('*', (req, res, next) => {
	next(new ExpressError("Page not found. !", 404))
})


app.use((err, req, res, next) => {
	const {status=500, message="Something Went Wrong!"} = err
	if(!err.status) err.status = 500;
	if(!err.message) err.message = "Something Went Wrong"
	res.status(status).render('error', {err})
})


app.listen(3000, () => {
	console.log("SERVING ON PORT 3000")
})
