const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fonction: String,
    nomClasse: String
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);