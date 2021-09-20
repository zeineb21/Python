"use strict";

var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var articleSchema = new mongoose.Schema({
  username: String,
  description: String
});
articleSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Article", articleSchema);