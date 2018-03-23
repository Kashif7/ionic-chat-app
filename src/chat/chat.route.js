(function () {
    angular
        .module('practeraChat.chat')
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('nav.chat', {
                url: '/chat',
                views: {
                    'tab-chat': {
                        templateUrl: 'templates/chat/chat-list.html',
                        controller: 'chatController',
                        controllerAs: 'chat'
                    }
                }
            });
    }
})();
