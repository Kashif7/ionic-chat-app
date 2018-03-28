(function () {
  angular
    .module('practeraChat.group')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('nav.groups', {
        cache: false,
        url: '/group',
        views: {
          'tab-group': {
            templateUrl: 'templates/group/group-list.html',
            controller: 'groupController',
            controllerAs: 'groupCtrl'
          }
        }
      })
  }
})();
