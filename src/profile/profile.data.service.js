/**
 * Created by sasangachathumal on 3/27/18.
 */
(function () {
  angular
    .module('practeraChat.profile')
    .factory('profileService', profileService);

  profileService.$inject = ['$http', 'backendUtilService', 'cookieManagerService'];

  function profileService($http, _backendUtilService, cookieManagerService) {

    let userProfile = {};

    return {
      getMyProfile: getMyProfile,
      setUserProfile: setUserProfile,
      getUserProfile: getUserProfile,
      updateUserProfile: updateUserProfile
    };

    function setUserProfile(profile) {
      userProfile = profile;
    }

    function getUserProfile() {
      return userProfile;
    }

    function getMyProfile(onSuccessCallback, onErrorCallback) {

      $http(_backendUtilService.createAuthenticateApiGetRequest('myProfile'))
        .then(function (successResponse) {
          console.log("data service success", successResponse);
          onSuccessCallback(successResponse);
        }, function (errorResponse) {
          onErrorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

    function updateUserProfile(data, onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticatedApiProfileUpdatedRequest(data, 'POST', 'profileUpdate'))
      .then(function (successResponse) {
        console.log("data service success", successResponse);
        onSuccessCallback(successResponse);
      }, function (errorResponse) {
        onErrorCallback(errorResponse);
        console.log("data service error", errorResponse);
      });
    }

  }
})();
