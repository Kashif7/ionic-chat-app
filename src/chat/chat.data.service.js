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
            getOldThreads: getOldThreads
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
    }
})();
