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
      getNewThreads: getNewThreads,
      getUpdatedThreads: getUpdatedThreads,
      getThreadsForAdmin: getThreadsForAdmin,
      getThreadsOb: getThreadsOb,
      getOldThreads: getOldThreads,
      getHelpdeskThreads: getHelpdeskThreads,
      getHelpdeskOldThreads: getHelpdeskOldThreads
    };

    function getThreads(userId, successCallback, errorCallback) {

      let ref = firebase.database()
        .ref(`/threads/${userId}`)
        .orderByChild('timeStamp');
      // .limitToFirst(noOfThreads);

      ref.once('value', successCallback);
      ref.off('value', successCallback);
    }

    function getNewThreads(userId, successCallback) {
      let ref = firebase.database()
        .ref(`/threads/${userId}`)
        .orderByChild('timeStamp');

      ref.on('child_added', successCallback);
    }

    function getUpdatedThreads(type, userId, successCallback) {
      let ref;
      console.log("type",type);
      if (type === 'Admin') {
        ref = firebase.database()
        .ref(`/threads/helpDesk`);
      } else {
        ref = firebase.database()
        .ref(`/threads/${userId}`);
      }

      ref.on('child_changed', successCallback);
    }

    function getThreadsOb(userId) {
      let ref = firebase.database()
        .ref(`/threads/${userId}`)
        .orderByChild('timeStamp');

      return $firebaseObject(ref);
      // .$loaded()
      // .then(successCallback)
      // .catch(errorCallback);
    }

    function getThreadsForAdmin(successCallback, errorCallback) {
      let ref = firebase.database()
        .ref(`/threads/helpDesk`)
        .orderByChild('timeStamp');
      // .limitToFirst(noOfThreads);
      ref.once('value', successCallback);
      ref.off('value', successCallback);
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
