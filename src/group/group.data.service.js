(function () {
    angular
        .module('practeraChat.group')
        .factory('groupDataService', groupDataService);

    groupDataService.$inject = ['$firebaseObject', '$firebaseArray'];

    function groupDataService($firebaseObject, $firebaseArray) {
        const noOfThreads = 3;
        let threads;
        let groupThreadIds = [];

        return {
            getGroups: getGroups,
            getOldGroups: getOldGroups
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
    }
})();
