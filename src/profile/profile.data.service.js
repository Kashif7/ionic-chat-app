/**
 * Created by sasangachathumal on 3/27/18.
 */
(function () {
  angular
    .module('practeraChat.profile')
    .factory('profileService', profileService);

  profileService.$inject = ['$http', 'backendUtilService', 'cookieManagerService'];

  function profileService($http, _backendUtilService, cookieManagerService) {

    return {
      createNormalChat: createOne2OneChat
    };

    function createOne2OneChat(data, onSuccessCallback, onErrorCallback) {

      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'normalChatCreate'))
        .then(function (successResponse) {
          console.log("data service success", successResponse);
          onSuccessCallback(successResponse);
          // checkSignInResponseStatus(successResponse, onSuccessCallback, onErrorCallback);
        }, function (errorResponse) {
          onErrorCallback(errorResponse);
          console.log("data service error", errorResponse);
          // checkSignInResponseStatus(errorResponse, onSuccessCallback, onErrorCallback);
        });
    }

    function checkSignInResponseStatus(response, onSuccessCallback, onErrorCallback) {
      if (response.status == 400 || response.status == 500) {
        onErrorCallback("Sign in error! Please try again!");
      } else if (response.status == 404) {
        onErrorCallback("Entered credentials not match to our records! Please try again!");
      } else if (response.status === 200) {
        cookieManagerService.setUserCookie(response.data.data);
        onSuccessCallback("Login success!");
      }
    }

  }
})();
