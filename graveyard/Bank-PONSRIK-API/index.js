require('express-async-errors');
const express = require('express');
const app = express();
const error = require('./middleware/error');
const path = require('path');
app.set('view engine', 'pug');

const admin = require('./middleware/admin');

require('./startup/db')();
require ('./startup/routes')(app);

app.use(error);
app.use( "/admin", [ admin, express.static(path.join( __dirname, "admin" )) ] );
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'http://localhost'
app.listen(port, () => console.log('Server started at: ' + host+":"+port));
