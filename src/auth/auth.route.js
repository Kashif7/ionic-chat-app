/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat.auth')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/signin.html',
        controller: 'authController',
        controllerAs: 'authCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'authController',
        controllerAs: 'authCtrl'
      })
  }
})();
