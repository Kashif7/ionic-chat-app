/**
 * Created by sasangachathumal on 3/26/18.
 */

(function () {
  angular
    .module('practeraChat.createChat')
    .factory('chatCreateService', chatCreateService);

  chatCreateService.$inject = ['$http', 'backendUtilService', 'cookieManagerService'];

  function chatCreateService($http, _backendUtilService, cookieManagerService) {

    let groupInfo = {};

    return {
      createNormalChat: createOne2OneChat,
      createGroupChat: createGroupChat,
      createChatHelpdesk: createHelpdeskChat,
      setGroupData: setGroupData,
      getGroupData: getGroupData
    };

    function setGroupData(group) {
      groupInfo = group;
    }

    function getGroupData() {
      return groupInfo;
    }

    function createOne2OneChat(data, onSuccessCallback, onErrorCallback) {

      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'normalChatCreate'))
        .then(function (successResponse) {
          console.log("data service success", successResponse);
          onSuccessCallback(successResponse);
        }, function (errorResponse) {
          onErrorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

    function createGroupChat(data, onSuccessCallback, onErrorCallback) {
      let request = _backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'groupChatCreate');

      $http(request).then(function (successResponse) {
        console.log("data service success", successResponse);
        onSuccessCallback(successResponse);
      }, function (errorResponse) {
        onErrorCallback(errorResponse);
        console.log("data service error", errorResponse);
      });
    }

    function createHelpdeskChat(onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData({}, 'POST', 'createHelpdeskChat'))
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
