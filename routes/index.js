
/*
 * GET home page.
 */
var url = require('url');

exports.index = function(req, res){
  console.log('request: ' + req.url);
  res.render('index', { title: 'Leadman Triathlon' });
};

exports.partials = function(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};