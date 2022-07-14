var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3000;
let mysql = require("mysql2");

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

var Users = require("./Routes/Users");

app.use("/users", Users);

app.get("/test-api", function (req, res) {
  res.send("hello");
});

app.listen(3001, function () {
  console.log("Server is running on port: 3001");
});
