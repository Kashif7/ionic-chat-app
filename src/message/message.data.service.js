(function () {
  angular
    .module('practeraChat.message')
    .factory('messageDataService', messageDataService);

  messageDataService.$inject = ['$firebaseObject', '$firebaseArray', '$http', 'cookieManagerService', 'backendUtilService', 'authService'];

  function messageDataService($firebaseObject, $firebaseArray, $http, _cookieManagerService, _backendUtilService,  _authService) {
    const noOfMessages = 20;
    // const noOfMessages = 9;
    let messages;
    let thread;
    let user;

    return {
      setThread: setThread,
      getThread: getThread,
      getUser: getUser,
      createNewPrivateMessage: createNewPrivateMessage,
      createNewGroupMessage: createNewGroupMessage,
      getMessages: getMessages,
      getOldMessages: getOldMessages,
      getNewMessage: getNewMessage,
      getGroupFromId: getGroupFromId,
      sendMessage: sendMessage,
      getGroupFromIdForGroup: getGroupFromIdForGroup,
      deleteCurrentConversation: deleteCurrentConversation,
      deleteCurrentConversationMessages: deleteCurrentConversationMessages
    };

    function setThread(selectedThread) {
      thread = selectedThread;
      updateUnseenCount();
    }

    function getThread() {
      return thread;
    }


    function getUser() {
      user = {
        userId: _cookieManagerService.getLoginUserId()
      };

      return user;
    }

    function updateUnseenCount() {
      // let ref = firebase.database()
      // .ref(`/threads/${userId}/${thread.threadId}`);

      thread.unseenCount = "0";

      let user = JSON.parse(localStorage.getItem('user')).id;

      var updates = {};
      updates[`/threads/${user}/${thread.threadId}`] = thread;

      // firebase.database().ref().update(updates);

      console.log(user,thread.threadId,'dduvheuhevvhev');

      firebase.database().ref().child(`/threads/${user}/${thread.threadId}`)
      .update({ unseenCount: "0" });

    }

    function createNewPrivateMessage() {
      let newMessage = {};
      newMessage.threadId = thread.threadId;
      let array = [];

      array[0] = parseInt(thread.user);
      newMessage.recipient = array;
      newMessage.message_type = 'Private';
      console.log("new message", newMessage.message_type);
      console.log("array", array);
      return newMessage;
    }

    function createNewGroupMessage(onSuccessCallback, onErrorCallback) {
      let newMessage = {};
      newMessage.threadId = thread.threadId;
      let array = [];
      let group = getGroupFromId(thread.groupId);

      group.$loaded()
        .then((group) => {
          newMessage.recipient = Object.keys(group.members).map(Number);
          onSuccessCallback(newMessage);
        })
        .catch((error) => {
          onErrorCallback(error);
          console.log(error);
        });
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
        newMessage.message_type = 'Private';
        return newMessage;
      } else {
        let group = getGroupFromId(thread.groupId);

        group.$loaded()
          .then((group) => {
            newMessage.recipient = Object.keys(group.members);
            newMessage.message_type = 'Group';            
            console.log("new message data service", newMessage);

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

    ref.on('value', successCallback);

      // $firebaseArray(ref)
      //   .$loaded()
      //   .then(successCallback)
      //   .catch(errorCallback);
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

    function getGroupFromIdForGroup(groupId, successCallback) {
      let refString = `groups/${groupId}`;
      firebase.database().ref(refString)
        .on('value', successCallback);
    }

    function sendMessage(newMessage) {
      let postBody = {
        text: newMessage.text,
        thread_id: newMessage.threadId,
        recipient: newMessage.recipient,
        message_type: newMessage.message_type
      };

      if (!_authService.serverUpdated()) {
        let firebaseToken = localStorage.getItem('firebase_token');
        _authService.setToken(firebaseToken);
      } 

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

    function deleteCurrentConversation(data, successCallback, errorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'deleteConversation'))
        .then(function (successResponse) {
          console.log("data service success", successResponse);
          successCallback(successResponse);
        }, function (errorResponse) {
          errorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

    function deleteCurrentConversationMessages(data, successCallback, errorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'deleteMessage'))
        .then(function (successResponse) {
          console.log("data service success", successResponse);
          successCallback(successResponse);
        }, function (errorResponse) {
          errorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

  }
})();
