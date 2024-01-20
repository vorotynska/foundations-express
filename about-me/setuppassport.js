/*const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy

module.exports = function () {
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

    passport.use("login",
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

                user.checkPassword(password, (isMatch) => {
                    if (!isMatch) {
                        // passwords do not match!
                        return done(null, false, {
                            message: "Incorrect password"
                        })
                    }
                    return done(null, user);
                })
            } catch (err) {
                return done(err);
            };
        })
    );
}*/

const passport = require("passport");
const User = require("./models/user");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function () {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    passport.use("login", new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({
                username: username
            });
            if (!user) {
                return done(null, false, {
                    message: "Incorrect username"
                });
            }

            const isMatch = await user.checkPassword(password);
            if (!isMatch) {
                return done(null, false, {
                    message: "Incorrect password"
                });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
};