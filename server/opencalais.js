var fs = require('fs');
var _ = require('lodash');

module.exports = function() {

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


  function init() {
    console.log('opencalais init...');
    fs.readFile('.calais_access_token', 'utf-8', function(err, data) {
      options.headers['x-ag-access-token'] = data;
      console.log(data);
    });
  };

  function create(payload) {
    console.log('opancalais create...');
    options.body = payload;
    return options;
  }

  function transform(data) {
    console.log('opancalais transform...');
    var result = [];
    _.forEach(data, function(v, k) {
      if (v.hasOwnProperty('name') && v.hasOwnProperty('importance')) {
        result.push( v.name );
      }
    })
    return result;
  }

  return {
    init: init,
    create: create,
    transform: transform
  }

}
