/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat.auth')
    .factory('authDataService', authDataService);

  authDataService.$inject = ['$http', 'backendUtilService', 'cookieManagerService'];

  function authDataService($http, _backendUtilService, cookieManagerService) {

    return {
      signIn: signIn,
      signUp: signUp,
      getUserList: userList,
      signOut: signOut,
      userListForAddMemberToGroup: userListForAddMemberToGroup
    };

    function signOut(onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData({}, 'POST', 'logout'))
        .then(function (successResponse) {
          onSuccessCallback(successResponse);
        }, function (errorResponse) {
          console.log("user list error", errorResponse);
          onErrorCallback(errorResponse);
        });
    }

    function userList(onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticateApiGetRequest('userList'))
        .then(function (successResponse) {
          let tempResponse = successResponse.data.data;
          let finalResponse = [];
          let newUserListData;
          for (var key in tempResponse) {
            if (tempResponse.hasOwnProperty(key)) {
              newUserListData = tempResponse[key];
              newUserListData.active = false;
              finalResponse.push(newUserListData);
            }
          }

          if (tempResponse.length === finalResponse.length) {
            onSuccessCallback(finalResponse);
          }
        }, function (errorResponse) {
          console.log("user list error", errorResponse);
          // checkSignInResponseStatus(errorResponse, onSuccessCallback, onErrorCallback);
        });
    }

    function userListForAddMemberToGroup(data, onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'addUserList'))
        .then(function (successResponse) {
          let tempResponse = successResponse.data.data;
          let finalResponse = [];
          let newUserListData;
          for (var key in tempResponse) {
            if (tempResponse.hasOwnProperty(key)) {
              newUserListData = tempResponse[key];
              newUserListData.active = false;
              finalResponse.push(newUserListData);
            }
          }

          if (tempResponse.length === finalResponse.length) {
            onSuccessCallback(finalResponse);
          }
        }, function (errorResponse) {
          onErrorCallback(errorResponse);
          console.log("user list error", errorResponse);
          // checkSignInResponseStatus(errorResponse, onSuccessCallback, onErrorCallback);
        });
    }

    function signIn(credential, onSuccessCallback, onErrorCallback) {

      $http(_backendUtilService.createApiRequest(credential, 'POST', 'userLogin'))
        .then(function (successResponse) {
          checkSignInResponseStatus(successResponse, onSuccessCallback, onErrorCallback);
        }, function (errorResponse) {
          checkSignInResponseStatus(errorResponse, onSuccessCallback, onErrorCallback);
        });
    }

    function signUp(user, onSuccessCallback, onErrorCallback) {

      $http(_backendUtilService.createApiRequest(user, 'POST', 'userSignUp'))
        .then(function (successResponse) {
          checkSignUpResponseStatus(successResponse, onSuccessCallback, onErrorCallback);
        }, function (errorResponse) {
          checkSignUpResponseStatus(errorResponse, onSuccessCallback, onErrorCallback);
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

    function checkSignUpResponseStatus(response, onSuccessCallback, onErrorCallback) {
      if (response.status == 400 || response.status == 500) {
        onErrorCallback("Registration fail! Please try again!");
      } else if (response.status == 404) {
        onErrorCallback("Registration fail! Please try again!");
      } else if (response.status === 200) {
        onSuccessCallback("Registration success!");
      }
    }

  }
})();
