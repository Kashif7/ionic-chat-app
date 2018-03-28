(function () {
  angular
    .module('practeraChat.message')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('messages', {
        cache: false,
        url: '/chat-messages',
        templateUrl: 'templates/message/message-view.html',
        controller: 'messageController',
        controllerAs: 'messageCtrl'
      });
  }
})();
