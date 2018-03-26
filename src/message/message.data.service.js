(function () {
    angular
        .module('practeraChat.message')
        .factory('messageDataService', messageDataService);

    messageDataService.$inject = ['$firebaseObject', '$firebaseArray', '$http'];

    function messageDataService($firebaseObject, $firebaseArray, $http) {
        const noOfMessages = 20;
        let messages;

        return {
            getMessages: getMessages,
            getOldMessages: getOldMessages,
            getGroupFromId: getGroupFromId,
            sendMessage: sendMessage
        };

        function getMessages(userId, threadId, successCallback, errorCallback) {
            let refString = `/messages/${userId}/${threadId}`;

            let ref = firebase.database()
                .ref(refString)
                .orderByChild('timeStamp')
                .limitToFirst(noOfMessages);

            $firebaseArray(ref)
                .$loaded()
                .then(successCallback)
                .catch(errorCallback);
        }

        function getOldMessages(userId, threadId, lastMessageId, successCallback, errorCallback) {
            let refString = `/messages/${userId}/${threadId}`; 

            let ref = firebase.database()
                .ref(refString)
                .endAt(lastMessageId)
                .orderByChild('timeStamp')
                .limitToLast(noOfMessages);

            $firebaseArray(ref)
                .$loaded()
                .then(successCallback)
                .catch(errorCallback);
        }

        function getGroupFromId(groupId) {
            let refString = `groups/${groupId}`;
            let ref = firebase.database()
            .ref(refString);

            return $firebaseObject(ref);
        }

        function sendMessage(newMessage) {
            let postBody = {
                text: newMessage.text,
                thread_id: newMessage.threadId,
                recipent: newMessage.recipent
            };

            $http.post('url', postBody)
                .then(successCallback)
                .catch(errorCallback);
        }
    }
})();