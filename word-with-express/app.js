const express = require("express");
const logger = require("morgan");
const path = require("path");
const http = require("http");

const app = express();

app.use(logger("short"));

//app.use(function (req, res, next) {
//console.log("In comes a request " + req.method + " to: " + req.url);
//next();
//});
//  Blacklisting an IP
const EVIL_IP = "123.45.67.89"
app.use(function (req, res, next) {
    if (req.ip === EVIL_IP) {
        res.status(401).send('Not allowed!')
    } else {
        next()
    }
})

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
/*
app.use(function (req, res, next) {
    res.writeHead(200, {
        "Content-type": "text/plain"
    });
    res.end("Look like you didn't find in static file");
})
*/
/*
app.get("/", function (req, res) {
    res.end("Welcome to my homepage!");
})

app.get("/about", function (req, res) {
    res.end("Welcome to about page!");
})

app.get("/weather", function (req, res) {
    res.end("The current weather is nice!");
})

app.use("/", function (req, res) {
    res.statusCode = 404;
    res.end("404!")
})
*/

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index", {
        message: "Hey everyone! This is my webpage!"
    })
})

http.createServer(app).listen(3000)