"use strict";

var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  fonction: String,
  nomClasse: String
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);