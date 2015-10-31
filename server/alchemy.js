var fs = require('fs');
var _ = require('lodash');

module.exports = function() {

  var accessKey = '';
  var options = {
    uri: 'http://access.alchemyapi.com/calls/text/TextGetRankedNamedEntities?',
    method: 'POST',
    body: '',
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
  };

  function init() {
    console.log('alchemy init...');
    fs.readFile('.alchemy_access_token', 'utf-8', function(err, data) {
      accessKey = data.trim();
      console.log(data);
    });
  }

  function create(payload) {
    options.body = 'apikey=' + accessKey +
      '&text=' + payload +
      '&outputMode=json' ;

    return options;
  }


  function transform(data) {
    console.log('alchemy transform...');
    var result = [];
    _.forEach(data.entities, function(entity) {
      result.push(entity.text);
    });
    return result;
  }

  return {
    init: init,
    create: create,
    transform: transform
  }
}
