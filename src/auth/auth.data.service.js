/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat.auth')
    .factory('authDataService', authDataService);

  authDataService.$inject = ['$http', 'backendUtilService'];

  function authDataService($http, backendUtilService) {

    return {
      signIn: signIn
    };

    function signIn(credential) {

      $http(createApiRequest(credential, 'POST', 'userLogin'))
        .then((successResponse) => {
          return {
            "status": "success",
            "message": "Log in Success"
          };
        }, (errorResponse) => {
          checkErrorResponseStatus(errorResponse);
        });
    }

    function createApiRequest(credential, method, type) {

      let api = backendUtilService.getApiUrl()['BackendUrl'];
      let endPoint = backendUtilService.getEndPoint(type);

      console.log({
        method: method,
        url: `${api}${endPoint}`,
        header: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        data: credential
      });

      return {
        method: method,
        url: `${api}${endPoint}`,
        header: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        data: credential
      };

    }

    function checkErrorResponseStatus(response) {
      if (response.status == 400 || response.status == 500) {
        return {
          "status": "error",
          "message": "Sign in error! Please try again!"
        };
      } else if (response.status == 404) {
        return {
          "status": "error",
          "message": "Entered credentials not match to our records! Please try again!"
        };
      }
    }

  }
})();
