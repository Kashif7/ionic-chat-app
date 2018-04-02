(function() {
    angular
        .module('practeraChat')
        .factory('authService', authService);

        authService.$inject = ['$http', 'cookieManagerService'];
        function authService($http, cookieManagerService) {
            let token;
            let isServerUpdated;
            return {
                setToken: setToken,
                updateToken: updateToken,
                serverUpdated: serverUpdated
            };

            function setToken(newToken) {
                token = newToken;
                updateToken();
            }

            function updateToken() {
                console.log(token, 'token');
                if (token) {
                    let userCookie = cookieManagerService.getUserCookie();
                    let user = JSON.parse(localStorage.getItem('user'));
                    console.log(user, 'user');
                    console.log(userCookie, 'userCOokie');
    
                    let json = {
                        method: 'POST',
                        url: 'http://ec2-54-84-172-12.compute-1.amazonaws.com:8000/users/update',
                        headers: {
                          'Content-Type': 'application/json',
                          'X-AUTH-TOKEN': userCookie.auth_token
                        },
                        data: {
                            push_token: token
                        }
                      };
                      console.log(json);
                      $http(json).then(success => {
                        console.log(success, 'success');
                      }).catch(error => {
                        console.log(error);
                      });

                      isServerUpdated = true;
                } else {
                    isServerUpdated = false;
                }
            }

            function serverUpdated() {
                return isServerUpdated;
            }
        }
})();