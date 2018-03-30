(function() {
    angular
        .module('practeraChat')
        .factory('authService', authService);

        authService.$inject = ['$http'];
        function authService($http) {
            return {
                updateToken: updateToken
            };

            function updateToken(token) {
                console.log('token recieved');
            }
        }
})();