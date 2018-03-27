/**
 * Created by sasangachathumal on 3/26/18.
 */

// (function () {
//   angular
//     .module('practeraChat.auth')
//     .factory('authDataService', authDataService);
//
//   authDataService.$inject = ['$http', 'backendUtilService', 'cookieManagerService'];
//
//   function authDataService($http, _backendUtilService, cookieManagerService) {
//
//     return {
//       signIn: signIn
//     };
//
//     function signIn(credential, onSuccessCallback, onErrorCallback) {
//
//       $http(_backendUtilService.createApiRequest(credential, 'POST', 'userLogin'))
//         .then(function (successResponse) {
//           checkSignInResponseStatus(successResponse, onSuccessCallback, onErrorCallback);
//         }, function (errorResponse) {
//           checkSignInResponseStatus(errorResponse, onSuccessCallback, onErrorCallback);
//         });
//     }
//
//     function checkSignInResponseStatus(response, onSuccessCallback, onErrorCallback) {
//       if (response.status == 400 || response.status == 500) {
//         onErrorCallback("Sign in error! Please try again!");
//       } else if (response.status == 404) {
//         onErrorCallback("Entered credentials not match to our records! Please try again!");
//       } else if (response.status === 200) {
//         cookieManagerService.setUserCookie(response.data.data);
//         onSuccessCallback("Login success!");
//       }
//     }
//
//   }
// })();
