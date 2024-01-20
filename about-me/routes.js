const express = require('express');
const User = require('./models/user');
const router = express.Router();
const passport = require('passport');

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to this page.");
        res.redirect("/login");
    }
}

router.get("/", async function (req, res, next) {
    try {
        res.locals.errors = req.flash("error");
        const infos = [];
        let users = await User.find()
            .sort({
                createdAt: "descending"
            }).exec()
        res.render("index", {
            users: users
        })

    } catch (err) {
        return next(err);
    }
});

router.get("/signup", async function (req, res) {
    res.render("signup");
});

router.post("/signup", async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.findOne({
            username: username
        });

        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        }

        const newUser = new User({
            username: username,
            password: password
        });

        await newUser.save();

        // Теперь, когда пользователь успешно зарегистрирован, вы можете выполнить вход
        passport.authenticate("login", {
            successRedirect: "/",
            failureRedirect: "/signup",
            failureFlash: true
        })(req, res, next);

    } catch (err) {
        return next(err);
    }
});

router.get("/users/:username", async (req, res, next) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        })
        if (!user) {
            return next(404);
        }
        res.render("profile", {
            user: user
        });
    } catch (err) {
        return next(err);
    }
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })
);
/*
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
*/

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

router.get("/edit", ensureAuthenticated, (req, res) => {
    res.render("edit");
});

router.post("/edit", ensureAuthenticated, async (req, res, next) => {
    try {
        req.user.displayName = req.body.displayName;
        req.user.bio = req.body.bio;
        await req.user.save();
        req.flash("info", "Profile updated!");
        res.redirect("/edit");
    } catch (err) {
        return next(err);
    }
});

module.exports = router;