require('express-async-errors');
const config = require('config');
const express = require('express');
const app = express();
const error = require('./middleware/error');
const path = require('path');
app.set('view engine', 'pug');

const admin = require('./middleware/admin');

require('./startup/db')();
require('./startup/routes')(app);

app.use(error);
app.use("/admin", [admin, express.static(path.join(__dirname, "admin"))]);
app.use("/admin-beta", [admin, express.static(path.join(__dirname, "admin-beta"))]);
app.use(express.static(path.join(__dirname, 'public')));

function getConfig() {

    if (app.get('env') == 'development') {
        return { port: process.env.PORT || 5500, host: process.env.HOST || 'http://localhost' }
    } else {
        return { port: process.env.app_port || 8080, host: process.env.app_host || '127.0.0.0' }
    }
}

const port = getConfig().port;
const host = getConfig().host;

app.listen(port, () => console.log('Server started at: ' + host + ":" + port + ' in ' + config.get('env') + " mode."));
