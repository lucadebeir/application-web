//déclaration de l'application
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();

//déclaration du port
var port = process.env.PORT || 3000;

//pour proteger les injection
var sanitizer = require("express-sanitizer");
let methodOverride = require("method-override");

//déclaration pour télécharger les images sur google storage
let fileUpload = require("express-fileupload");
const { Storage } = require("@google-cloud/storage");
let multer = require("multer");
let multerGoogleStorage = require("multer-google-storage");
const path = require("path");
const uploadImage = require("./helpers/helpers");

//https
//var sslRedirect = require("heroku-ssl-redirect").default;
var forceSSL = require("./middleware/forcessl.js");

//FCM
/*var FCM = require("fcm-node");
var serverKey =
  "AAAA5n3DS64:APA91bEJm6xWRwuqA4LWGpu6RFS9xnO7169adBNdn01r6aaDgHXJft-7SRbQ-Gaue4tZFQkiBYo2oCJLMb23avUFNX7eecUr50xFKfybENcYeM3N6tXDZdQU083SPzV9_uZhppbhbFVt"; //put your server key here
var fcm = new FCM(serverKey);
var topic = "notif";*/

//déclaration de ce que l'app utilise comme module
app.use(sanitizer());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(sslRedirect());
app.use(forceSSL());

const dotenv = require("dotenv");
dotenv.config();

//déclaration des routes
var Users = require("./routes/Users");
var Recipes = require("./routes/Recipes");
var UtiliserIngredients = require("./routes/UtiliserIngredients");
var Unites = require("./routes/Unites");
var ShoppingList = require("./routes/ShoppingList");
var Menu = require("./routes/Menus");
var Ingredient = require("./routes/Ingredients");
var Image = require("./routes/Images");
var Favori = require("./routes/Favoris");
var Commentaire = require("./routes/Commentaires");
var ClasserDans = require("./routes/ClasserDans");
var Categorie = require("./routes/Categories");
var RecipeList = require("./routes/RecipeList");
var Notification = require("./routes/Notification");
var Statistique = require("./routes/Statistiques");

app.use("/server", Users);
app.use("/server/recipe", Recipes);
app.use("/server/recipe", UtiliserIngredients);
app.use("/server/unite", Unites);
app.use("/server/shoppingList", ShoppingList);
app.use("/server/menu", Menu);
app.use("/server/ingredient", Ingredient);
app.use("/server/image", Image);
app.use("/server/favorites", Favori);
app.use("/server/commentaires", Commentaire);
app.use("/server", ClasserDans);
app.use("/server/category", Categorie);
app.use("/server/recipeList", RecipeList);
app.use("/server/notifications", Notification);
app.use("/server/statistique", Statistique);

//Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist/marine'srecipe"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/marine'srecipe/index.html"));
});

//lancement serveur
app.listen(port, function () {
  console.log("Server is running on port " + port);
});

//util?
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
app.disable("x-powered-by");
app.use(multerMid.single("file"));

app.post("/uploads", async (req, res, next) => {
  try {
    const myFile = req.file;
    const imageUrl = await uploadImage(myFile);

    res.status(200).json({
      message: "Upload was successful",
      data: imageUrl,
    });
  } catch (error) {
    next(error);
  }
});

app.use(methodOverride("_method"));
app.use(fileUpload());
