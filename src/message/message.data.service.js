(function () {
  angular
    .module('practeraChat.message')
    .factory('messageDataService', messageDataService);

  messageDataService.$inject = ['$firebaseObject', '$firebaseArray', '$http', 'cookieManagerService'];

  function messageDataService($firebaseObject, $firebaseArray, $http, _cookieManagerService) {
    const noOfMessages = 9;
    let messages;
    let thread;
    let user;

    return {
      setThread: setThread,
      getUser: getUser,
      createNewMessage: createNewMessage,
      getMessages: getMessages,
      getOldMessages: getOldMessages,
      getNewMessage: getNewMessage,
      getGroupFromId: getGroupFromId,
      sendMessage: sendMessage
    };

    function setThread(selectedThread) {
      thread = selectedThread;
    }

    function getUser() {
      user = {
        userId: _cookieManagerService.getLoginUserId()
      };

      return user;
    }

    function createNewMessage() {
      let newMessage = {};
      newMessage.threadId = thread.threadId;
      let array = [];

      if (thread.type === 'Private') {
        array[0] = parseInt(thread.user);
        newMessage.recipient = array;
        console.log("new message", newMessage);
        console.log("array", array);
        return newMessage;
      } else {
        let group = getGroupFromId(thread.groupId);

        group.$loaded()
          .then((group) => {
            newMessage.recipient = Object.keys(group.members);

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
        .orderByKey()
        .limitToLast(noOfMessages);

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
        .orderByKey()
        .limitToLast(noOfMessages);

      $firebaseArray(ref)
        .$loaded()
        .then(successCallback)
        .catch(errorCallback);
    }

    function getNewMessage(userId, successCallback) {
      let refString = `/messages/${userId}/${thread.threadId}`;

      firebase.database().ref(refString)
        .orderByChild('timeStamp')
        .limitToLast(1)
        .on('value', successCallback);
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
        recipient: newMessage.recipient
      };

      let userCookie = _cookieManagerService.getUserCookie();

      console.log(userCookie);

      let json = {
        method: 'POST',
        url: 'http://ec2-54-84-172-12.compute-1.amazonaws.com:8000/users/message',
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-TOKEN': userCookie.auth_token
        },
        data: postBody
      };
      console.log(json);
      $http(json).then(success => {
        console.log(success);
      }).catch(error => {
        console.log(error);
      });

      // $http.post('url', postBody)
      //     .then(successCallback)
      //     .catch(errorCallback);
    }
  }
})();
