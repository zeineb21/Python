const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const espaceVirtuelSchema = new mongoose.Schema({
    username: String,
    lien: String
});

espaceVirtuelSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("EspaceVirtuel", espaceVirtuelSchema);