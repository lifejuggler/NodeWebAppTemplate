var requestProxy = require('request');
var static = require('node-static');
var express = require('express');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var fs = require('fs');


///////////////////////////////////////////////////////////////////////////////
// Open Calais
///////////////////////////////////////////////////////////////////////////////
var options = {
  uri: 'https://api.thomsonreuters.com/permid/calais?',
  method: 'POST',
  body: '',
  headers : {
    'x-ag-access-token': '<read_token_from_file>',
    'x-calais-language': 'English',
    'Content-Type': 'text/raw',
    'Accept': 'application/json',
    'outputFormat': 'application/json'
  }
};

fs.readFile('.calais_access_token', 'utf-8', function(err, data) {
  console.log('my key is :', data);
  options.headers['x-ag-access-token'] = data;
});



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
  id: 'x',
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
  options.body = text;

  requestProxy(options, function(err, response, data) {
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.json( JSON.parse(data) );
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




