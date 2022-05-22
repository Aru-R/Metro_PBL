const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const userRouter = require('./routers/user')
// const bookingRouter = require('./routers/booking')

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

console.log('check1')
// Static files (css, js, images) and view engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.set('partials', partialsPath);
// app.set('layouts', layoutsPath);

console.log('check2')
// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Parsing request body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

console.log('check3')
// Routes
app.use(userRouter)
// app.use(bookingRouter)

console.log('check4')
// Start server
app.listen(port, () => {
    console.log("Server is running on port 3000");
});

