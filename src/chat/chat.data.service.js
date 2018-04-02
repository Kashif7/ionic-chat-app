(function () {
  angular
    .module('practeraChat.chat')
    .factory('chatDataService', chatDataService);

  chatDataService.$inject = ['$firebaseObject', '$firebaseArray'];

  function chatDataService($firebaseObject, $firebaseArray) {
    const noOfThreads = 3;
    let threads;

    return {
      getThreads: getThreads,
      getThreadsForAdmin: getThreadsForAdmin,
      getOldThreads: getOldThreads,
      getHelpdeskThreads: getHelpdeskThreads,
      getHelpdeskOldThreads: getHelpdeskOldThreads
    };

    function getThreads(userId, successCallback, errorCallback) {
      let ref = firebase.database()
        .ref(`/threads/${userId}`)
        .orderByChild('timeStamp');
      // .limitToFirst(noOfThreads);

      $firebaseArray(ref)
        .$loaded()
        .then(successCallback)
        .catch(errorCallback);
    }

    function getThreadsForAdmin(successCallback, errorCallback) {
      let ref = firebase.database()
        .ref(`/threads`)
        .orderByChild('timeStamp');
      // .limitToFirst(noOfThreads);

      $firebaseArray(ref)
        .$loaded()
        .then(successCallback)
        .catch(errorCallback);
    }

    function getOldThreads(userId, lastThreadId, successCallback, errorCallback) {
      let ref = firebase.database()
        .ref(`/threads/${userId}`)
        .endAt(lastThreadId)
        .orderByChild('timeStamp')
        .limitToLast(noOfThreads);

      $firebaseArray(ref)
        .$loaded()
        .then(successCallback)
        .catch(errorCallback);
    }

    function getHelpdeskThreads(userId, successCallback) {
      let refString = `threads/helpDesk/${userId}`;
      firebase.database().ref(refString)
        .on('value', successCallback);

    }

    function getHelpdeskOldThreads(userId, lastThreadId, successCallback, errorCallback) {
      let ref = firebase.database()
        .ref(`/threads/helpDesk/${userId}`)
        .endAt(lastThreadId)
        .orderByChild('timeStamp')
        .limitToLast(noOfThreads);

      $firebaseArray(ref)
        .$loaded()
        .then(successCallback)
        .catch(errorCallback);
    }

  }
})();
