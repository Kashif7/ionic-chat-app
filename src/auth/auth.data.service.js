/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat.auth')
    .factory('authDataService', authDataService);

  authDataService.$inject = ['$http', 'backendUtilService', '$state', 'cookieManagerService'];

  function authDataService($http, backendUtilService, $state, cookieManagerService) {

    return {
      signIn: signIn
    };

    function signIn(credential, AuthController) {

      $http(createApiRequest(credential, 'POST', 'userLogin'))
        .then(function (successResponse) {
          checkResponseStatus(successResponse, AuthController);
        }, function (errorResponse) {
          checkResponseStatus(errorResponse, AuthController);
        });
    }

    function createApiRequest(credential, method, type) {

      let api = backendUtilService.getApiUrl()['BackendUrl'];
      let endPoint = backendUtilService.getEndPoint(type);

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

    function onSuccessSignIn(response, controller) {
      cookieManagerService.setUserCookie(response.data.data);
      controller.signInStatus = "success";
      controller.signInMessage = "Log in Success";
      $state.go('nav.chat');
    }

    function checkResponseStatus(response, controller) {
      if (response.status == 400 || response.status == 500) {
        controller.signInStatus = "error";
        controller.signInMessage = "Sign in error! Please try again!";
      } else if (response.status == 404) {
        controller.signInStatus = "error";
        controller.signInMessage = "Entered credentials not match to our records! Please try again!";
      } else if (response.status === 200) {
        onSuccessSignIn(response, controller);
      }
    }

  }
})();
