const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const sanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");

app.use(sanitizer());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

//Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist/marine'srecipe"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/marine'srecipe/index.html"));
});

app.listen(process.env.PORT || 8080);
