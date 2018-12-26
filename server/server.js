const path          = require('path');
const express       = require('express');
const bodyParser    = require("body-parser");
const listEndpoints = require("express-list-endpoints");

const app           = express();
const publicPath    = path.join(__dirname, '..', 'public');
const port          = process.env.PORT || 3000;
// console.log = function(){}; // disable log in server

const cors          = require('./middleware/cors');
const authRouter    = require('./routes/auth');
const userRouter    = require('./routes/users');
const accountRouter = require('./routes/account');

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(publicPath));

app.use("/api/v1", [
  accountRouter,
  authRouter,
  userRouter
]);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicPath, 'index.html'));
// });

app.listen(port, () => {
  console.log('Server is up!');
});