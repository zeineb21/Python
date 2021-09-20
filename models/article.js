const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const articleSchema = new mongoose.Schema({
    username: String,
    description: String
});

articleSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Article", articleSchema);