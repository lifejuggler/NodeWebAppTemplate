var app = angular.module('BaseApp', [
  'restangular',
  'ui.router'
]);

app.controller('PostController', function($scope, Restangular) {

  $scope.oTags = [];
  $scope.dTags = [];

  $scope.sendPost = function() {
    var payload = {
      name: $scope.name,
      text: $scope.text
    };

    Restangular.one('api').post('calais', payload).then(function(data) {
      data = Restangular.stripRestangular(data);
      console.log(data);
      $scope.oTags = data;
    });

    Restangular.one('api').post('dandelion', payload).then(function(data) {
      data = Restangular.stripRestangular(data);
      console.log(data);
      $scope.dTags = data;
    });

  };

});
