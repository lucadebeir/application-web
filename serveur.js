var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var port = process.env.PORT || 3000
var sanitizer  = require("express-sanitizer") //pour proteger les injection 
const date = require('date-and-time')
const multer = require('multer')
var multerGoogleStorage = require('multer-google-storage');
const path = require('path');

app.use(sanitizer())
app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({ extended: false })
)

var Users = require("./routes/Users")
var Recipes = require("./routes/Recipes")

app.use("/server", Users)
app.use("/server", Recipes)

app.listen(port, function () {
    console.log("Server is running on port " + port)
})

//pour google cloud
var uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine({
        keyFilename: "./molten-calling-270223-7d6d4b3665fa.json",
        projectId: 'molten-calling-270223',
        bucket: 'recipes-of-marine'
    })
});

//app.use('/public', express.static(__dirname + '/public'));
//app.use(express('views'));
/* creer une page testform
app.get('/upload', function (req, res) {
    res.render('testform')
})
*/
app.post('/upload', uploadHandler.any(), function (req, res) {
    console.log("azertyuio")
    res.json(req.files);
});
