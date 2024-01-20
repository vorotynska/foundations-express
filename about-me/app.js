const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require("passport");
const path = require('path');
const cookieParse = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const routes = require('./routes');

const setUpPassport = require("./setuppassport");
const app = express();

mongoose.connect(process.env.DB, {
    //  useNewUrlParser: true,
    // useUnifiedTopology: true
});

setUpPassport();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParse());
app.use(session({
    secret: "TGRvOOIs=HGasasas3",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})