(function () {
    angular
        .module('practeraChat.chat')
        .factory('chatDataService', chatDataService);

    chatDataService.$inject = ['$firebaseObject', '$firebaseArray'];

    function chatDataService($firebaseObject, $firebaseArray) {
        const noOfThreads = 1;
        let threads;
        
        return {
            getThreads: getThreads,
            getOldThreads: getOldThreads
        };

        function getThreads(userId, successCallback, errorCallback) {
            let ref = firebase.database()
                .ref(`/threads/${userId}`)
                .orderByKey()
                .limitToFirst(noOfThreads);

            $firebaseArray(ref)
                .$loaded()
                .then(successCallback)
                .catch(errorCallback);
        }

        function getOldThreads(userId, lastThreadId, successCallback, errorCallback) {
            let ref = firebase.database()
                .ref(`/threads/${userId}`)
                .startAt(lastThreadId)
                .orderByKey()
                .limitToFirst(noOfThreads);

            $firebaseArray(ref)
                .$loaded()
                .then(successCallback)
                .catch(errorCallback);
        }
    }
})();