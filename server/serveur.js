var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var port = process.env.PORT || 3000
var sanitizer = require("express-sanitizer") //pour proteger les injection 
const date = require('date-and-time')
let methodOverride = require('method-override');
let fileUpload = require('express-fileupload');
const { Storage } = require('@google-cloud/storage');
let multer = require('multer');
let multerGoogleStorage = require('multer-google-storage');
const path = require('path');
const uploadImage = require('./helpers/helpers')


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

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/<name-of-app>'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/<name-of-app>/index.html'));
});

app.listen(port, function () {
    console.log("Server is running on port " + port)
})

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
})
app.disable('x-powered-by')
app.use(multerMid.single('file'))

app.post('/uploads', async (req, res, next) => {
    try {
      const myFile = req.file
      console.log(req)
      const imageUrl = await uploadImage(myFile)
  
      res
        .status(200)
        .json({
          message: "Upload was successful",
          data: imageUrl
        })
    } catch (error) {
      next(error)
    }
  })


app.use(methodOverride('_method'));
app.use(fileUpload());

//pour google cloud

//app.use('/public', express.static(__dirname + '/public'));
//app.use(express('views'));
/* creer une page testform
app.get('/upload', function (req, res) {
    res.render('testform')
})
*/
