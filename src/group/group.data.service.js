(function () {
  angular
    .module('practeraChat.group')
    .factory('groupDataService', groupDataService);

  groupDataService.$inject = ['$firebaseObject', '$firebaseArray', '$http', 'backendUtilService'];

  function groupDataService($firebaseObject, $firebaseArray, $http, _backendUtilService) {
    const noOfThreads = 3;
    let threads;
    let groupThreadIds = [];

    return {
      getGroups: getGroups,
      getOldGroups: getOldGroups,
      UpdateGroupNameOrImage: UpdateGroupNameOrImage,
      getGroupMembers: getGroupMembers
    };

    function getGroups(userId, successCallback, errorCallback) {
      let ref = firebase.database()
        .ref(`/threads/${userId}`)
        .orderByChild('type')
        .equalTo('Group');

      $firebaseArray(ref)
        .$loaded()
        .then(successCallback)
        .catch(errorCallback);
    }

    function getOldGroups(userId, lastGroupId, successCallback, errorCallback) {
      let ref = firebase.database()
        .ref(`/threads/${userId}`)
        .endAt(lastGroupId)
        .orderByChild('type')
        .equalTo('Group');

      $firebaseArray(ref)
        .$loaded()
        .then(successCallback)
        .catch(errorCallback);
    }

    function UpdateGroupNameOrImage(data, onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'groupEdit'))
        .then(function (successResponse) {
          console.log("data service success", successResponse);
          onSuccessCallback(successResponse);
        }, function (errorResponse) {
          onErrorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

    function getGroupMembers(data, onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'groupUsers'))
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
