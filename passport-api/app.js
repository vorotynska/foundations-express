const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Schema = mongoose.Schema;

const app = express();

const User = mongoose.model("User", new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({
                username: username
            });
            if (!user) {
                return done(null, false, {
                    message: "Incorrect username"
                });
            };
            //  if (user.password !== password) {
            //      return done(null, false, {
            //          message: "Incorrect password"
            //      });
            //};
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                // passwords do not match!
                return done(null, false, {
                    message: "Incorrect password"
                })
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        };
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    };
});

app.use(passport.session());
app.use(express.urlencoded({
    extended: false
}));

app.get("/", (req, res) => res.render("index", {
    user: req.user
}));

app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.post("/sign-up", async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });

        const result = await user.save();
        res.redirect("/");
    } catch (err) {
        return next(err);
    }
});

app.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
);

app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

mongoose.connect(process.env.DB, {
    //  useNewUrlParser: true,
    // useUnifiedTopology: true
});

mongoose.connection.on("error", err => {
    console.error("MongoDB connection error:", err);
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})