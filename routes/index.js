
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
    console.log('loading partial: ' + name);
    res.render('partials/' + name);
};

exports.anon = function(req, res) {
    var name = req.params.name;
    res.render('anon/' + name);
}