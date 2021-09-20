const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const devoirSchema = new mongoose.Schema({
    username: String,
    nomClasse: String,
    matiere: String,
    deadline: Date,
    description: String,
    file: String
});

devoirSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Devoir", devoirSchema);