const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/metro_pbl', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'assets')));

// if auth then redirect to private page
app.get('/', (req, res) => {
    res.render('booking/index')
});
    

app.get("/booking/login", (req, res) => {
    res.render('booking/login');
});

app.get("/booking/new", (req, res) => {
    res.render('booking/new');
});

// 
app.get("/booking/pass", (req, res) => {
    res.render('booking/pass');
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

