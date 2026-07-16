require('express-async-errors');
const express = require('express');
const app = express();
app.set('view engine', 'pug');
const error = require('./middleware/error');

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

require('./startup/db')();
require ('./startup/routes')(app);

app.use(error);

const port = process.env.app_port || 8080;
const host = process.env.app_host || '127.0.0.0';
app.listen(port, () => console.log('Server running http//:'+host+':'+port));