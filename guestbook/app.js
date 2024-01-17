const http = require("http");
const path = require("path");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
/*
app.get("/", function (req, res) {
    res.render("index", {
        message: "Hey everyone! This is my webpage!"
    })
})
*/
let entries = [];
app.locals.entries = entries;

app.use(logger("dev"));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get("/", function (req, res) {
    res.render("index")
})

app.get("/new-entry", function (req, res) {
    res.render("new-entry")
})

app.post("/new-entry", function (req, res) {
    if (!req.body.title || !req.body.content) {
        res.status(400).send("Entries must have a title and a body.");
        return;
    };
    entries.push({
        title: req.body.title,
        content: req.body.content,
        published: new Date()
    });
    res.redirect("/")
})

app.use(function (req, res) {
    res.status(404).render("404");
})

http.createServer(app).listen(3000, function () {
    console.log("Guestbook app started on port 3000.")
});