const express       = require("express");
const status        = require('http-status');
const md5           = require('md5');
const { 
  check, validationResult 
} = require('express-validator/check');
// custom
const app           = express();
const models        = require("../database/models");
const validationApi = require("./../middleware/authenticate");
const { 
  Success, Failed } = require('../utils/response');

app.get("/users", validationApi, (req, res) => {
  models.user.findAll({
    include: [ models.account ]
  }).then(results => {
      Success({
        res,
        code: status["200"], 
        status: status.OK, 
        total: results.length, 
        results
      });
    }).catch(err => {
      Failed({
        res, 
        code: status["400"], 
        message: err
      });
    });
});

app.get("/user/:id", validationApi, (req, res) => {
  models.user.findOne({
    where: { id: req.params.id },
    include: [ models.account ]
  }).then(results => {
      Success({
        res,
        code: status["200"], 
        status: status.OK, 
        total: results.length, 
        results
      });
    }).catch(err => {
      Failed({
        res, 
        code: status["400"], 
        message: "Result not found"
      });
    });
});

app.post("/user", validationApi, (req, res) => {
    const data = { ...req.body };
    if(data.password) {
      data.password = md5(data.password)
    }

    models.user.create(data).then(result => {
      Success({
        res,
        code: status["200"], 
        status: status.OK, 
        results: result
      });
    }).catch(err => {
      Failed({
        res, 
        code: status["400"], 
        message: err
      });
    });
  }
);

app.patch("/user/:id", validationApi, (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.body.password) {
      data.password = md5(req.body.password);
    }

    models.user.update(data, {
      where: { id },
      returning: true,
      plain: true
    }).then(result => {
      Success({
        res,
        code: status["200"], 
        status: status.OK, 
        total: result[1],
        results: result[1] === 0 ? null:{ id, ...data }
      });
    }).catch(err => {
      Failed({
        res, 
        code: status["400"], 
        message: err
      });
    });
  }
);

app.delete("/user/:id", validationApi, (req, res) => {
    const { id } = req.params;
    const data = { isActive: false };

    models.user.update(data, {
      where: { id },
      returning: true,
      plain: true
    }).then(result => {
      Success({
        res,
        code: status["200"], 
        status: status.OK, 
        total: result[1],
        results: result[1] === 0 ? null:{ id, ...data }
      });
    }).catch(err => {
      Failed({
        res, 
        code: status["400"], 
        message: err
      });
    });
  }
);

app.delete("/user/:id/force", validationApi, (req, res) => {
    const { id } = req.params;

    models.user.find({
      where: {id}
    }).then((result) => {
        models.account.destroy({ 
          where: { userId: id }
        });
        
        return models.user.destroy({ 
          where: { id }
        }).then((u) => {
          Success({
            res,
            code: status["200"], 
            status: status.OK, 
            total: result === null ? 0:1,
            results: result
          }); 
        });
    }).catch(err => {
      Failed({
        res, 
        code: status["400"], 
        message: err
      });
    });
  }
);

module.exports = app;