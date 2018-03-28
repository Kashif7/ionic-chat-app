/**
 * Created by sasangachathumal on 3/26/18.
 */
(function () {
  angular
    .module('practeraChat.createChat')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('contact-list', {
        url: '/contact-list/:viewName',
        templateUrl: 'templates/contact/contact-list.html',
        controller: 'chatCreateController',
        controllerAs: 'contactCtrl'
      })
  }
})();
