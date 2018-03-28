/**
 * Created by sasangachathumal on 3/27/18.
 */
(function () {
  angular
    .module('practeraChat.profile')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('profile', {
        cache: false,
        url: '/profile',
        templateUrl: 'templates/profile/profile-view.html',
        controller: 'profileController',
        controllerAs: 'profileCtrl'
      })
      .state('profileEdit', {
        cache: false,
        url: '/profileEdit',
        templateUrl: 'templates/profile/profile-edit.html',
        controller: 'profileController',
        controllerAs: 'profileCtrl'
      })
  }
})();
