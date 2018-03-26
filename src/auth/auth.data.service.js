/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat.auth')
    .factory('authDataService', authDataService);

  authDataService.$inject = ['$http', 'backendUtilService', '$state'];

  function authDataService($http, backendUtilService, $state) {

    return {
      signIn: signIn,
      signUp: signUp
    };

    function signIn(credential, AuthController) {

      $http(createApiRequest(credential, 'POST', 'userLogin'))
        .then(function (successResponse) {
          checkSignInResponseStatus(successResponse, AuthController);
        }, function (errorResponse) {
          checkSignInResponseStatus(errorResponse, AuthController);
        });
    }

    function signUp(user, onSuccessCallback, onErrorCallback) {

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

    function checkSignInResponseStatus(response, controller) {
      if (response.status == 400 || response.status == 500) {
        controller.signInStatus = "error";
        controller.signInMessage = "Sign in error! Please try again!";
      } else if (response.status == 404) {
        controller.signInStatus = "error";
        controller.signInMessage = "Entered credentials not match to our records! Please try again!";
      } else if (response.status === 200) {
        controller.signInStatus = "success";
        controller.signInMessage = "Log in Success";
        $state.go('nav.chat');
      }
    }

  }
})();
