var fs = require('fs');
var _ = require('lodash') ;

module.exports = function() {

  var appId, accessKey;
  var uri = 'https://api.dandelion.eu/datatxt/nex/v1?lang=en';

  var options = {
    uri: '',
    method: 'GET'
  };


  function init() {
    console.log('dandelio init...');
    fs.readFile('.dandelion_access_token', 'utf-8', function(err, data) {
      data = data.split(/\n/)[0];
      appId = data.split('=')[0];
      accessKey = data.split('=')[1];
      console.log(appId, ' - ',  accessKey);
    });
  }

  function create(payload) {
    console.log('dandelion create...');

    options.uri = uri +
      '&min_confidence=0.2' +
      '&$app_id=' + appId +
      '&$app_key=' + accessKey +
      '&text=' + encodeURIComponent(payload);

    return options;
  }

  function transform(data) {
    console.log('dandelion transform');
    return _.pluck(data.annotations, 'label');
  }

  return {
    init: init,
    create: create,
    transform: transform
  };
}
