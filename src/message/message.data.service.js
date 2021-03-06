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
      createNewHelpDeskMessage: createNewHelpDeskMessage,
      getMessages: getMessages,
      getOldMessages: getOldMessages,
      getNewMessage: getNewMessage,
      getGroupFromId: getGroupFromId,
      sendMessage: sendMessage,
      sendMessageToHelpDesk: sendMessageToHelpDesk,
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
      let userID = JSON.parse(localStorage.getItem('user')).id;
      let userType = JSON.parse(localStorage.getItem('user')).user_type;
      if (thread.type === 'Help Desk') {
        if (userType === 'User') {
          console.log(userID,thread.threadId,'thread type Help Desk - user type User');

          firebase.database().ref().child(`/threads/helpDesk/${userID}`)
            .update({ unseenCount: "0" });
        } else {
          console.log(userID,thread.threadId,'thread type Help Desk - user type Admin');

          firebase.database().ref().child(`/threads/helpDesk/${thread.threadId}`)
            .update({ helpDeskCount: "0" });
        }
      } else {
        console.log(userID,thread.threadId,'thread type not Help Desk');

        let x= firebase.database().ref().child(`/threads/${userID}/${thread.threadId}`)
          .update({ unseenCount: "0" });

        console.log(x);
      }

    }

    function createNewPrivateMessage() {
      let newMessage = {};
      newMessage.threadId = thread.threadId;
      let array = [];

      array[0] = parseInt(thread.user);
      newMessage.recipient = array;
      newMessage.message_type = 'Private';
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

    function createNewHelpDeskMessage() {
      let newMessage = {};
      newMessage.threadId = thread.threadId;
      return newMessage;
    }

    function createNewMessage() {
      let newMessage = {};
      newMessage.threadId = thread.threadId;
      let array = [];

      if (thread.type === 'Private') {
        array[0] = parseInt(thread.user);
        newMessage.recipient = array;
        newMessage.message_type = 'Private';
        return newMessage;
      } else {
        let group = getGroupFromId(thread.groupId);

        group.$loaded()
          .then((group) => {
            newMessage.recipient = Object.keys(group.members);
            newMessage.message_type = 'Group';

            return newMessage;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    function getMessages(type, userId, successCallback, errorCallback) {
      let refString;
      if (type === 'help') {
        refString = `/messages/helpDesk/${thread.threadId}`;
      } else {
        refString = `/messages/${userId}/${thread.threadId}`;
      }

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

    function getOldMessages(type, userId, lastMessageId, successCallback, errorCallback) {
      let refString;
      if (type === 'help') {
        refString = `/messages/helpDesk/${userId}`;
      } else {
        refString = `/messages/${userId}/${thread.threadId}`;
      }

      let ref = firebase.database()
        .ref(refString)
        .endAt(lastMessageId)
        .orderByKey()
        .limitToLast(noOfMessages);

        ref.on('value', successCallback);
    }

    function getNewMessage(type, userId, successCallback) {
      let refString;
      if (type === 'help') {
        refString = `/messages/helpDesk/${userId}`;
      } else {
        refString = `/messages/${userId}/${thread.threadId}`;
      }

      firebase.database().ref(refString)
        .orderByChild('timeStamp')
        .limitToLast(1)
        .on('value', successCallback);
      
      updateUnseenCount();
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

      let json = {
        method: 'POST',
        url: 'http://ec2-54-84-172-12.compute-1.amazonaws.com:8000/users/message',
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-TOKEN': userCookie.auth_token
        },
        data: postBody
      };
      $http(json).then(success => {
        console.log(success);
      }).catch(error => {
        console.log(error);
      });

      // $http.post('url', postBody)
      //     .then(successCallback)
      //     .catch(errorCallback);
    }

    function sendMessageToHelpDesk(newMessage, successCallback, errorCallback) {
      let postBody = {
        text: newMessage.text,
        thread_id: newMessage.threadId
      };
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(postBody, 'POST', 'sendMessageToHelpdesk'))
        .then(function (successResponse) {
          successCallback(successResponse);
        }, function (errorResponse) {
          errorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

    function deleteCurrentConversation(data, successCallback, errorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'deleteConversation'))
        .then(function (successResponse) {
          successCallback(successResponse);
        }, function (errorResponse) {
          errorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

    function deleteCurrentConversationMessages(data, successCallback, errorCallback) {
      $http(_backendUtilService.createAuthenticatedApiRequestWithData(data, 'POST', 'deleteMessage'))
        .then(function (successResponse) {
          successCallback(successResponse);
        }, function (errorResponse) {
          errorCallback(errorResponse);
          console.log("data service error", errorResponse);
        });
    }

  }
})();
