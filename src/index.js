const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const userRouter = require('./routers/user')
const session = require('express-session')
const bookingRouter = require('./routers/booking')
const flash = require('connect-flash')

// database connection
mongoose.connect('mongodb://127.0.0.1:27017/metro_pbl', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// middleware
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const layoutsPath = path.join(__dirname, '../templates/layouts')


// Static files (css, js, images) and view engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.set('partials', partialsPath);
// app.set('layouts', layoutsPath);




// Parsing request body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // 2 weeks
    },
}))
app.use(flash())

// Setup static directory to serve
app.use('/', express.static(publicDirectoryPath))
app.use('/users', express.static(publicDirectoryPath))
app.use('/booking', express.static(publicDirectoryPath))

app.use((req, res, next) => {
	console.log(req.session);
	res.locals.currentUser = req.session.token;
	next();
});

app.get('/', (req, res) => {
    const currentUser = req.session.token ? true : false;
    res.locals.currentUser = currentUser;
    res.render('index')
})

// Routes
app.use("/users", userRouter)
app.use("/booking", bookingRouter)

app.get('/routes', (req, res) => {
    res.render('route')
})

app.get('/error', async (req, res) => {
    res.render('caution')
})

app.get('/loginerror', async (req, res) => {
    console.log("req.flash(error)",req.flash('error')[0])
    res.render('login', {error: req.flash('error')})
})




// Start server
app.listen(port, () => {
    console.log("Server is running on port 3000");
});

