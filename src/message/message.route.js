(function () {
    angular
        .module('practeraChat.message')
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('messages', {
            url: '/chat-messages',
            templateUrl: 'templates/message/message-view.html',
            controller: 'messageController',
            controllerAs: 'messageCtrl'
          });
    }
})();
 