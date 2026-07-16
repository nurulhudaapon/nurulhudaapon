
module.exports = function(err, req, res, next){
    //log
    console.error('Error: '+err.message, err);
    res.status(500).send('Something failed in the server:'+err.message);
}