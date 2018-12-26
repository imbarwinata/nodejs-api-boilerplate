var jwt = require("jsonwebtoken");
var config = require("./../utils/settings");
var localStorage = require('localStorage');

function validationApi(req, res, next) {
  const apiKey = req.headers['api-key'];
  const token =
    localStorage.getItem('token') != null
      ? localStorage.getItem('token')
      : req.headers["x-access-token"];

  if (!token)
    return res.status(200).send({ 
      code: "MissingParameter", 
      message: "No token provided." 
    });
  
  if(apiKey === undefined || apiKey !== config.apiKey)
    return res.status(200).send({ 
      code: "MissingParameter",
      message: "You must provide a user key."
    });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
      return res
        .status(200)
        .send({ 
          auth: "MissingParameter", 
          message: "Failed to authenticate token." 
        });
    req.userId = decoded.id;
    next();
  });
}

module.exports = validationApi;