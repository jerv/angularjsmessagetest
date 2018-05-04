// Module

var myApp = angular.module('messageApp', ['ngRoute', 'ngAnimate']);

// Factories

myApp.factory('http', ['$http', function ($http) {
  return {
    get: function(url, options) {
      return $http.get(url, options);
    },
    delete: function(url, options) {
      return $http.delete(url, options);
    },
    post: function(url, data, options) {
      return $http.post(url, data, options);
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
    templateUrl: 'inbox.html'
  })
  .when('/sent', {
    templateUrl: 'sent.html'
  })
  .when('/login', {
    templateUrl: 'login.html'
  })
  .otherwise({
    redirectTo: '/login'
  });

}]);


// Controllers

myApp.controller('mainController', ['$scope', 'http', '$q', '$location', '$rootScope', function ($scope, http, $q, $location, $rootScope) {

  var serverUrl = 'https://iostest.bixly.com/';
  $scope.loginCridentials = {
    username: '',
    password: ''
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
    getToken($scope.loginCridentials).then(function(token){
      return http.get(serverUrl + "messages/", {headers: {'Authorization': 'Token ' + token}}).then(function(res) {
        $scope.messages = res.data;
      });
    });
  }

  // get sent messages
  function getSentMessages() {
    getToken($scope.loginCridentials).then(function(token){
      return http.get(serverUrl + "messages/sent/", {headers: {'Authorization': 'Token ' + token}}).then(function(res) {
        $scope.sentMessages = res.data;
      });
    });
  }

  $scope.messageTitle = "";
  $scope.messageBody = "";
  $scope.messageRecipient = "";

  $scope.sendMessage = function() {
    getToken($scope.loginCridentials).then(function(token){
      return http.post(serverUrl + "messages/", {
        'body': $scope.messageBody,
        'receiver': $scope.messageRecipient,
        'title': $scope.messageTitle}, {headers: {'Authorization': 'Token ' + token }}).then(function(res) {
        $scope.success = res.data;
        $scope.toggleCompose = !$scope.toggleCompose;
        getMessages();
      });
    });
  }

  $scope.deleteMessage = function(messageNumber) {
    getToken($scope.loginCridentials).then(function(token){
      return http.delete(serverUrl + "messages/" + messageNumber + "/", {headers: {'Authorization': 'Token ' + token }}).then(function(res) {
        $scope.success = res.data;
        getMessages();
      });
    });
  }

  $scope.changeUser = function() {
    console.log($scope.currentUser);
    console.log($scope.currentPassword);

    getMessages();
    getSentMessages();
  }

}]);
