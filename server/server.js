var request = require('request');
var static = require('node-static');
var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var fs = require('fs');

var opencalais = require('./opencalais')();
var dandelion = require('./dandelion')();


opencalais.init();
dandelion.init();

setTimeout(function() {
  var payload = 'The Mona Lisa is a 16th century oil painting created by Leonardo. It\'s held at the Louvre in Paris.';
  var oPayload = opencalais.create(payload);
  var dPayload = dandelion.create(payload);

  console.log('Payload: ', payload);

  request(dPayload, function(err, response, data) {
    console.log(dandelion.transform(JSON.parse(data)));
  });

  request(oPayload, function(err, response, data) {
    console.log(opencalais.transform(JSON.parse(data)));
  });

}, 2000);



///////////////////////////////////////////////////////////////////////////////
// Elasticsearch
///////////////////////////////////////////////////////////////////////////////

/*
var client = elasticsearch.Client({
  host: 'localhost:9200'
});

client.create({
  index: 'ctest',
  type: 'typeTest',
  // id: 'x',
  body: {
    title: 'hello world',
    tags: ['tag1', 'tag2', 'tag3'],
    text: 'The quick brown fox jumps over the lazy dog.'
  }
});
*/




///////////////////////////////////////////////////////////////////////////////
// Server
///////////////////////////////////////////////////////////////////////////////
var file = new(static.Server)('../client');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json() );


app.post('/api/calais', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;

  request(opencalais.create(text), function(err, response, data) {
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.json(opencalais.transform(JSON.parse(data)) );
  });

});

app.post('/api/dandelion', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;

  request(dandelion.create(text), function(err, response, data) {
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.json(dandelion.transform(JSON.parse(data)) );
  });
});




////////////////////////////////////////////////////////////////////////////////
// This needs to go last
////////////////////////////////////////////////////////////////////////////////
app.get(/\w*/, function(req, res){
   file.serve(req, res);
});


app.listen(54321);
console.log('Start server on :54321');
