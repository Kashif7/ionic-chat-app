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
      getGroupMembers: getGroupMembers,
      removeGroupMembers: removeGroupMembers,
      addGroupMembers: addGroupMembers,
      leaveFromGroup: leaveFromGroup
    };

    function getGroups(userId, successCallback, errorCallback) {
      let ref = firebase.database()
        .ref(`/threads/${userId}`)
        .orderByChild('type')
        .equalTo('Group');

      ref.on('value', successCallback);
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

    function removeGroupMembers(data, onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'removeMember'))
        .then(function (successResponse) {
          console.log("data service success", successResponse);
          onSuccessCallback(successResponse);
        }, function (errorResponse) {
          onErrorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

    function addGroupMembers(data, onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'addMember'))
        .then(function (successResponse) {
          console.log("data service success", successResponse);
          onSuccessCallback(successResponse);
        }, function (errorResponse) {
          onErrorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

    function leaveFromGroup(data, onSuccessCallback, onErrorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'leaveGroup'))
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
