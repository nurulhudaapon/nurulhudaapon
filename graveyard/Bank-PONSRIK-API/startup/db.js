const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    if(!config.get('database.uri')) {
        console.error('FATAL ERROR: MongoDB URI not defined');
        process.exit(1);
    }
    mongoose.connect(config.get('database.uri'),{ useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
        .then(()=> console.log('Conected to MongoDB...'))
        .catch(()=> console.log('Could not connect to  MongDB...'));
}