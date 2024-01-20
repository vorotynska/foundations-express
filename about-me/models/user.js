/*const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");

const SALT_FACTOR = 10;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    displayName: String,
    bio: String,
});

// A do-nothing function for use with the bcrypt module
let noop = function () {};

// Defines the function that runs before model is saved 
userSchema.pre("save", function (done) {

    // Save a reference to the user
    let user = this;

    // Skip this logik if password isn't modified
    if (!user.isModified("password")) {
        return done();
    }
    // Generates a sult for the hash, and call the inner function once completed
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
            if (err) {
                return done(err);
            }
            // Stores the password and continues with the saving
            user.password = hashedPassword;
            done();
        });
    });

});

// Checking the user’s password
userSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

// If the user has defined a display name, return that; otherwise, return their username
userSchema.methods.name = function () {
    return this.displayName || this.username;
};

const User = mongoose.model("User", userSchema);

module.exports = User; */

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const SALT_FACTOR = 10;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    displayName: String,
    bio: String,
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.checkPassword = async function (guess) {
    return await bcrypt.compare(guess, this.password);
};

userSchema.methods.name = function () {
    return this.displayName || this.username;
};

const User = mongoose.model("User", userSchema);

module.exports = User;