/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat.auth')
    .factory('authDataService', authDataService);

  authDataService.$inject = ['$http', 'backendUtilService', '$state', 'cookieManagerService'];

  function authDataService($http, _backendUtilService, $state, cookieManagerService) {

    return {
      signIn: signIn,
      signUp: signUp
    };

    function signIn(credential, AuthController) {

      $http(_backendUtilService.createApiRequest(credential, 'POST', 'userLogin'))
        .then(function (successResponse) {
          checkSignInResponseStatus(successResponse, AuthController);
        }, function (errorResponse) {
          checkSignInResponseStatus(errorResponse, AuthController);
        });
    }

    function signUp(user, onSuccessCallback, onErrorCallback) {

    }

    function onSuccessSignIn(response, controller) {
      cookieManagerService.setUserCookie(response.data.data);
      controller.signInStatus = "success";
      controller.signInMessage = "Log in Success";
      $state.go('nav.chat');
    }

    function checkSignInResponseStatus(response, controller) {
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
