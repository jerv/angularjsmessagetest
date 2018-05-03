// Module

var myApp = angular.module('messageApp', ['ngRoute', 'ngAnimate']);

// Factories

myApp.factory('http', ['$http', function ($http) {
  return {
    get: function(url, options) {
      return $http.get(url, options);
    },
    post: function(url, options) {
      return $http.post(url, options);
    },
  };
}]);

// Routes
myApp.config(['$routeProvider', function ($routeProvider) {

  /**
  * $routeProvider
  */
  $routeProvider
  .when('/', {
    templateUrl: 'main.html'
  })
  .when('/sent', {
    templateUrl: 'sent.html'
  })
  .otherwise({
    redirectTo: '/'
  });

}]);


// Controllers

myApp.controller('mainController', ['$scope', 'http', '$q', '$location', '$rootScope', function ($scope, http, $q, $location, $rootScope) {
  var serverUrl = 'https://iostest.bixly.com/';
  userName = {
    username: "test",
    password: "test123!"
  };

  $scope.location = $location.path();
  $rootScope.$on('$routeChangeSuccess', function() {
      $scope.location = $location.path();
  });

  // Get the token.
  function getToken(loginInfo) {
    return http.post(serverUrl + "api-token-auth/", loginInfo).then(function(res) {
      return res.data.token;
    });
  }

  // get the inbox
  function getMessages() {
    getToken(userName).then(function(token){
      return http.get(serverUrl + "messages/", {headers: {'Authorization': 'Token ' + token}}).then(function(res) {
        $scope.messages = res.data;
      });
    });
  }

  // get sent messages
  function getSentMessages() {
    getToken(userName).then(function(token){
      return http.get(serverUrl + "messages/sent/", {headers: {'Authorization': 'Token ' + token}}).then(function(res) {
        $scope.sentMessages = res.data;
      });
    });
  }

  getMessages();
  getSentMessages();

}]);
