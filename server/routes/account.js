const express = require("express");
const status = require('http-status');
// custom
const app = express();
const models = require("../database/models");
const validationApi = require("./../middleware/authenticate");
const { Success, Failed } = require('../utils/response');

app.get("/user/:id/account", validationApi, (req, res) => {
  models.account.findOne({
    where: { userId: req.params.id },
    include: [ models.user ]
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

app.post("/user/:id/account", validationApi, (req, res) => {
    const data = { 
        ...req.body, 
        userId: req.params.id };
    
    models.account.findOne({
        where: { userId: req.params.id }
    }).then(check => {
        if ( check !== null ){
            Failed({
                res, 
                code: status["400"], 
                message: 'Data account exist'
            });
        } else {
            models.account.create(data).then(result => {
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
    });
  }
);

app.patch("/user/:id/account", validationApi, (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };

    models.account.update(data, {
      where: { userId: id },
      returning: true,
      plain: true
    }).then(result => {
      Success({
        res,
        code: status["200"], 
        status: status.OK, 
        total: result[1],
        results: result[1] === 0 ? null:{ userId: id, ...data }
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