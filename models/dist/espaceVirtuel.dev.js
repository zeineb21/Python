"use strict";

var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var espaceVirtuelSchema = new mongoose.Schema({
  username: String,
  lien: String
});
espaceVirtuelSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("EspaceVirtuel", espaceVirtuelSchema);