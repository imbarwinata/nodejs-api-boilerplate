const express = require("express");
const app = express();
const models = require("../database/models");
const bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var config = require("./../utils/settings");
var localStorage = require("localStorage");
let md5 = require('md5');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.post("/auth/login", (req, res) => {
  const {email, password} = req.body;

  models.user.findOne({
    where: { email, password: md5(password) }
  })
    .then(result => {
      var token = jwt.sign(
        { id: result.id, email: result.email },
        config.secret,
        {
          expiresIn: 60 * 60 // expires in 24 hours
        }
      );
      localStorage.setItem("auth", true);
      localStorage.setItem("token", token);

      res
        .status(200)
        .send({
          auth: localStorage.getItem("auth"),
          token: localStorage.getItem("token")
        });
    })
    .catch(err => {
      res.send({ auth: false, token: null });
    });
});

app.get("/auth/logout", function(req, res) {
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  res.status(200).send({ auth: false, token: null });
});

app.post("/auth/checkToken", (req, res) => {
  var token = req.body.token;
  if (!token) 
    return res.send({ 
      auth: false, 
      token: null 
    });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) 
      return res.send({ 
        auth: false, 
        token: null 
      });

    res.send({ 
      auth: true, 
      token: token 
    });
  });
});

module.exports = app;