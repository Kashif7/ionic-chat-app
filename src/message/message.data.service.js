(function () {
    angular
        .module('practeraChat.message')
        .factory('messageDataService', messageDataService);

    messageDataService.$inject = ['$firebaseObject', '$firebaseArray', '$http'];

    function messageDataService($firebaseObject, $firebaseArray, $http) {
        const noOfMessages = 20;
        let messages;
        let thread;
        let user;

        return {
            setThread: setThread,
            getUser: getUser,
            createNewMessage: createNewMessage,
            getMessages: getMessages,
            getOldMessages: getOldMessages,
            getGroupFromId: getGroupFromId,
            sendMessage: sendMessage
        };

        function setThread(selectedThread) {
            thread = selectedThread;
        }

        function getUser() {
            user = {
                userId: 1
            };

            return user;
        }

        function createNewMessage() {
            let newMessage = {};
            newMessage.threadId = thread.threadId;

            if (thread.type === 'private') {
                newMessage.recipent = thread.user;

                return newMessage;
            } else {
                let group = getGroupFromId(thread.groupId);

                group.$loaded()
                    .then((group) => {
                        newMessage.recipent = Object.keys(group.members);

                        return newMessage;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }

        function getMessages(userId, successCallback, errorCallback) {
            console.log("thread", thread);
            let refString = `/messages/${userId}/${thread.threadId}`;

            let ref = firebase.database()
                .ref(refString)
                .orderByChild('timeStamp')
                .limitToFirst(noOfMessages);

            $firebaseArray(ref)
                .$loaded()
                .then(successCallback)
                .catch(errorCallback);
        }

        function getOldMessages(userId, lastMessageId, successCallback, errorCallback) {
            let refString = `/messages/${userId}/${thread.threadId}`;

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