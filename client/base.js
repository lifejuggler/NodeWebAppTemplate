var app = angular.module('BaseApp', [
  'restangular',
  'ui.router'
]);

app.controller('PostController', function($scope, Restangular) {

  $scope.tags = [];

  $scope.sendPost = function() {
    var payload = {
      name: $scope.name,
      text: $scope.text
    };
    console.log("Payload is: ", payload);
    Restangular.one('api').post('calais', payload).then(function(data) {
      data = Restangular.stripRestangular(data);
      console.log(data);

      $scope.tags = data;
    });
  };

});
