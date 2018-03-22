(function () {
    angular
        .module('practeraChat.chat', []);

    routes.$inject = ['$stateProvider'];
    function routes($stateProvider) {
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
            })
    }
})();