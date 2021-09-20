const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");


const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//models
const User = require("./models/user.js");
const Devoir = require("./models/devoir.js");
const Article = require("./models/article.js");
const EspaceVirtuel = require("./models/espaceVirtuel.js");

//SESSION
app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false
}));

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://testWeb:TEST@cluster0.cswqn.mongodb.net/EducaTn?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//PASSPORT LOCAL MONGOOSE
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//EJS
app.set("view-engine", "ejs");

//public folder
app.use(express.static("public"));

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

const methodOverride = require("method-override");
const flash = require("connect-flash");
const { connect } = require("http2");


app.get("/", (req, res) => {
    Article.find({}, function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render("index.ejs", { Listearticle: articles });
        }
    });
});
app.get("/login", function(req, res) {
    res.render("login.ejs");
});
app.get("/presence", function(req, res) {
    res.render("presence.ejs");
});
app.get("/cours", function(req, res) {
    res.render("cours.ejs");
});
app.get("/presence", function(req, res) {
    res.render("presence.ejs");
});
app.get("/espaceEtudiant", function(req, res) {
    res.render("accueil_etudiant.ejs");
});
app.get("/coursEtudiant", function(req, res) {
    res.render("cours_etudiant.ejs");
});
app.get("/espaceProf", function(req, res) {
    res.render("accueil_prof.ejs");
});
app.get("/accueil", function(req, res) {
    res.render("accueil_connect.ejs");
});
app.get("/webmaster", function(req, res) {
    res.render("webmaster.ejs");
});
app.get("/ajouterDevoir", function(req, res) {
    res.render("form_prof.ejs");
});
app.get("/ajouterArticle", function(req, res) {
    res.render("form_article.ejs");
});
app.get("/ajouterLien", function(req, res) {
    res.render("form_cowork.ejs");
});
app.get("/calendrierProf", function(req, res) {
    res.render("calendrier_prof.ejs");
});
app.get("/calendrierEtudiant", function(req, res) {
    res.render("calendrier_etudiant.ejs");
});
app.get("/logout", function(req, res) {
    req.logout();
    req.redirect("/login");
});

//login sans passport
app.post("/login", function(req, res) {
    User.findOne({
        username: req.body.username,
        fonction: req.body.fonction
    }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    if (result == true) {
                        console.log("super t'es connecté!");
                        console.log(req.body.fonction.localeCompare("Etudiant"));
                        if ((req.body.fonction.localeCompare("Etudiant")) == 0) {
                            res.render("accueil_etudiant.ejs");
                        }
                        if ((req.body.fonction.localeCompare("Professeur")) == 0) {
                            res.render("accueil_prof.ejs");
                        }
                        if ((req.body.fonction.localeCompare("Webmaster")) == 0) {
                            res.render("webmaster.ejs");
                        }

                    }
                });
            } else {
                res.send("error"); //retourner au login 
            }
        }
    });
});
//ajout d'un devoir
function appendInFile(fileName, Object) {
    let data = readFile(fileName);
    data.push(Object);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), "utf-8");
}

function readFile(fileName) {
    let fileData = JSON.parse(fs.readFileSync(fileName));
    return fileData;
}

app.post("/ajouterDevoir", function(req, res) {
    const devoir = {
            username: req.body.username,
            nomClasse: req.body.nomClasse,
            matiere: req.body.matiere,
            deadline: req.body.deadline,
            description: req.body.description,
            file: req.body.file
        }
        //appendInFile("public/data.json", devoir)
        //readFile("public/data.json")
    Devoir.create(devoir, function(err, devoir) {
        if (err) {
            console.log(err);
        } else {
            res.render("form_prof.ejs");
        }
    });
});
app.post("/ajouterArticle", function(req, res) {
    const article = {
        username: req.body.username,
        description: req.body.description
    }
    Article.create(article, function(err, devoir) {
        if (err) {
            console.log(err);
        } else {
            res.render("form_article.ejs");
        }
    });
});
app.post("/ajouterLien", function(req, res) {
    const espaceVirtuel = {
        username: req.body.username,
        lien: req.body.lien
    }
    EspaceVirtuel.create(espaceVirtuel, function(err, devoir) {
        if (err) {
            console.log(err);
        } else {
            res.render("form_cowork.ejs");
        }
    });
});

//login avec passport
/*app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.email,
        password: req.body.password,
        fonction: req.body.fonction
    });
    req.login(user, function(err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function() {
                if ((req.body.fonction.localeCompare("Etudiant")) == 0) {
                    res.render("accueil_etudiant.ejs");
                }
                if ((req.body.fonction.localeCompare("Professeur")) == 0) {
                    res.render("accueil_prof.ejs");
                }
                if ((req.body.fonction.localeCompare("Webmaster")) == 0) {
                    res.render("webmaster.ejs");
                }
            });
        }
    });
});*/
//creation des utilisateurs avec passport
/*app.post("/login", function(req, res) {
    const newUser = new User({
        username: req.body.username,
        fonction: req.body.fonction,
        nomClasse: req.body.nomClasse
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.render("login.ejs");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("login");
            });
        }
    });
});*/
//creation des utilisateurs avec bcrypt
/*app.post("/login", function(req, res) {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user = {
            username: req.body.username,
            password: hash,
            fonction: req.body.fonction,
            nomClasse: req.body.nomClasse

        }
        User.create(user, function(err) {
            if (err) {
                console.log(err);
            } else {
                res.render("index.ejs");
            }
        });
    });
});*/

app.listen(4200, function(req, res) {
    console.log("tout marche bien !");
});