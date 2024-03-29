var request = require('request');
var static = require('node-static');
var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var fs = require('fs');

var opencalais = require('./opencalais')();
var dandelion = require('./dandelion')();
var alchemy = require('./alchemy')();


opencalais.init();
dandelion.init();
alchemy.init();

setTimeout(function() {
  var payload = 'The Mona Lisa is a 16th century oil painting created by Leonardo. It\'s held at the Louvre in Paris.';
  var payload = 'We had already decided we would offer our bodies to a medical school. Our lawyer pointed out that the medical school would likely want to examine the brain of someone with dementia, particularly when that person had kept a public diary of sorts. I think my columns have provided much of that information. I would like to put myself in a position where I could help in pursuit of a cure for dementia. I know it sounds ghoulish, even perhaps a bit self-serving, but that’s the kind of conversation we need to have before the inevitable. It’s important for everyone, but, in my case, it’s important to have those conversations now.';
  var oPayload = opencalais.create(payload);
  var dPayload = dandelion.create(payload);
  var aPayload = alchemy.create(payload);

  request(dPayload, function(err, response, data) {
    console.log(dandelion.transform(JSON.parse(data)));
  });

  request(oPayload, function(err, response, data) {
    console.log(opencalais.transform(JSON.parse(data)));
  });

  request(aPayload, function(err, response, data) {
    console.log(response);
    console.log(alchemy.transform(JSON.parse(data)));
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


app.post('/api/alchemy', function(req, res) {
  var name = req.body.name;
  var text = req.body.text;

  request(alchemy.create(text), function(err, response, data) {
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.json(alchemy.transform(JSON.parse(data)) );
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
