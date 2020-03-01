var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var port = process.env.PORT || 3000
var sanitizer  = require("express-sanitizer") //pour proteger les injection 
const date = require('date-and-time')

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