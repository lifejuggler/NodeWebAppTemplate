var app = angular.module('BaseApp', [
  'restangular',
  'ui.router'
]);

app.controller('PostController', function($scope, Restangular) {

  $scope.oTags = [];
  $scope.dTags = [];
  $scope.aTags = [];

  $scope.sendPost = function() {
    var payload = {
      name: $scope.name,
      text: $scope.text
    };

    Restangular.one('api').post('calais', payload).then(function(data) {
      data = Restangular.stripRestangular(data);
      $scope.oTags = data;
    });

    Restangular.one('api').post('dandelion', payload).then(function(data) {
      data = Restangular.stripRestangular(data);
      console.log('Dandelion : ', data);
      $scope.dTags = data;
    });

    Restangular.one('api').post('alchemy', payload).then(function(data) {
      data = Restangular.stripRestangular(data);
      $scope.aTags = data;
    });


  };

});
