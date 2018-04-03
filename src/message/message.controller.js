'use strict';
(function () {
  angular
    .module('practeraChat.message')
    .controller('messageController', messageController);

  messageController.$inject = ['messageDataService', '$state', '$ionicPopup', '$ionicPopover', '$ionicScrollDelegate', '$scope', '$location', '$ionicActionSheet', 'cookieManagerService'];

  function messageController(_messageDataService, $state, $ionicPopup, $ionicPopover, $ionicScrollDelegate, $scope, $location, $ionicActionSheet, _cookieManagerService) {
    let vm = this;

    vm.chatType = $location.search()['type'];
    vm.messages = [];
    vm.newMessageText = '';
    vm.chatName = '';
    vm.displayLoadMore = false;

    vm.arrangeAvatar = arrangeAvatar;
    vm.showAvatarImage = showAvatarImage;
    vm.arrangeBubble = arrangeBubble;
    vm.sendMessage = sendMessage;
    vm.loadOldMessages = loadOlderMessages;
    vm.listenForEnter = listenForEnter;
    vm.goToBackView = goToBackView;
    vm.messageTimeShow = messageTimeShow;
    vm.deleteConversation = deleteConversation;
    vm.messageOnHold = messageOnHold;
    vm.getMessageTime = getMessageTime;

    let lastMessageId;
    let user;
    let newMessage = {};
    let isLoaded;
    let thread;
    let groupInfo;

    let userType = _cookieManagerService.getLoginUserType();

    function messageTimeShow(id) {
      let e = document.getElementById(id);

      if (e.classList.contains('show')) {
        e.classList.remove('show');
      } else {
        e.classList.add('show');
      }
    }

    let messageDay;

    function getMessageTime(time) {
      messageDay = new Date(time * 1000);
      let toDay = new Date();
      let dateDifference = toDay.getDate() - messageDay.getDate();
      if (dateDifference === 1) {
        return "yesterday";
      } else if (dateDifference < 1) {
        let timeDifference = toDay - messageDay;
        return checkTimeDifference(timeDifference);
      } else {
        return $filter('date')(time * 1000, "MMM dd, yyyy");
      }
    }

    function checkTimeDifference(timeDifference) {
      let time = '';
      let msec = timeDifference;
      let hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      let mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      let ss = Math.floor(msec / 1000);
      msec -= ss * 1000;

      if (hh > 0) {
        time = hh + "hours ago";
      } else if (mm > 0) {
        time = mm + "minutes ago";
      } else {
        time = ss + "seconds ago";
      }

      return time;

    }

    function goToBackView() {
      $state.go('nav.chat');
    }

    function arrangeAvatar(senderId) {
      return senderId != user.userId ? 'item-avatar-left bubbleLeft' : 'item-avatar-right bubbleRight';
    }

    function showAvatarImage(senderId) {
      return senderId != user.userId ? true : false;
    }

    function arrangeBubble(senderId) {
      return senderId == user.userId ? 'bubbleRight' : 'bubbleLeft';
    }

    function sendMessageToHelpDeskOnSuccessCallback(response) {
      console.log(response);
    }

    function sendMessage() {
      console.log(newMessage, 'newMessage');
      newMessage.text = vm.newMessageText;
      if (vm.newMessageText) {
        if (vm.chatType === 'Help Desk') {
          _messageDataService.sendMessageToHelpDesk(newMessage, sendMessageToHelpDeskOnSuccessCallback);
        } else {
          _messageDataService.sendMessage(newMessage);
        }
      }

      vm.newMessageText = '';
    }

    function loadOlderMessages() {
      isLoaded = true;
      if (thread.type === 'Private') {
        _messageDataService.getOldMessages('one', user.userId, lastMessageId, appendMessages, messagesOnError);
      }  else if (thread.type === 'Group') {
        _messageDataService.getOldMessages('group', user.userId, lastMessageId, appendMessages, messagesOnError);
      } else {
        _messageDataService.getOldMessages('help', user.userId, lastMessageId, appendMessages, messagesOnError);
      }
    }

    function listenForEnter(event) {
      if (event.keyCode === 10 || event.keyCode === 13) {
        if (!event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      }
    }

    function addMessages(messages) {
      setTimeout(() => {
        $scope.$apply(() => {
          add(messages);
        });
      }, 0);
    }

    function add(messages) {
      let index = 0;
      vm.threads.length = 0;
      if (threads.numChildren() > 0) {
        threads.forEach((thread) => {
          vm.threads.push(thread.val());

          if (index === threads.numChildren() - 1) {
            vm.threads.sort(sort);
          }
          index++;
        });
      }
    }

    function messagesOnSuccess(messages) {
      let length = messages.numChildren();
      messages = messages.val();

      setLoadMoreButton(length);

      $scope.$apply(() => {
        if (length > 0) {
          console.log('vm.messages', vm.messages);
          if (vm.messages.length === 0) {
            vm.messages = Array.from(messages);
            console.log(vm.messages, 'vm.messages');
          } else {
            vm.messages = messages.concat(vm.messages.slice(1, vm.messages.length));
            console.log(vm.messages, 'vm.messages');
          }
          lastMessageId = vm.messages[0].$id;
        } else {
          // newMessage = _messageDataService.createNewMessage();
          // console.log(newMessage, "messagesOnSuccess");
        }

        if (isLoaded) {
          isLoaded = false;
        } else {
          $ionicScrollDelegate.scrollBottom();
        }
      });
    }

    function setLoadMoreButton(messagesLength) {
      if (messagesLength > 0) {
        vm.displayLoadMore = messagesLength >= 20;
      } else {
        vm.displayLoadMore = false;
      }
    }

    function messagesOnError(error) {
      console.error('error', error);
    }

    function onNewMessageSuccess(snapshot) {
      snapshot.forEach((childSnapShot) => {
        setTimeout(() => {
          $scope.$apply(() => {
            if (!checkExist(childSnapShot.key)) {
              pushNewMessage(childSnapShot);
            }
          });
          $ionicScrollDelegate.scrollBottom();
        }, 0);
      });
    }

    function pushNewMessage(childSnapShot) {
      if (findDuplicate(childSnapShot.key) === -1) {
        vm.messages.push(childSnapShot.val());
      }
    }

    function findDuplicate(key) {
      return vm.messages.findIndex((element) => {
        return element.$id == key;
      });
    }

    $scope.deleteThisConversation = function () {
      deleteConversation();
    };

    $ionicPopover.fromTemplateUrl('templates/chat/popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    vm.openPopover = function ($event) {
      $scope.popover.show($event);
    };
    vm.closePopover = function () {
      $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.popover.remove();
    });
    // Execute action on hidden popover
    $scope.$on('popover.hidden', function () {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
    });

    function createNewGroupMessageOnSuccess(message) {
      newMessage = message;
    }

    function createNewGroupMessageOnError(error) {

    }

    function getGroupFromIdForGroupSuccessCallback(snapshot) {
      groupInfo = snapshot.val();
      vm.chatName = groupInfo.name;
    }

    function messageOnHold(messageIndex) {

      if (thread.type === 'Private' || thread.type === 'Group') {
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            { text: '<i class="icon ion-trash-a"></i> Delete Message' }
          ],
          buttonClicked: function (index) {
            if (index === 0) {
              let messageDeleteData = {
                message_id: vm.messages[messageIndex].messageId,
                thread_id: thread.threadId,
                user_ids: newMessage.recipient,
                message_type: thread.type
              };

              deleteMessages(messageDeleteData);

            }
            return true;
          }
        });
      }
    }

    function deleteMessagesOnSuccessCallback(response) { }

    function deleteMessagesOnErrorCallback(error) {
      console.error(error);
    }

    function deleteMessages(data) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Message?',
        template: 'Once you delete it cannot be undone.'
      });
      confirmPopup.then(function (res) {
        if (res) {
          _messageDataService.deleteCurrentConversationMessages(data, deleteMessagesOnSuccessCallback, deleteMessagesOnErrorCallback);
        } else {
        }
      });
    }

    function deleteConversationOnSuccessCallback(response) {
      $state.go('nav.chat');
    }

    function deleteConversationOnErrorCallback(error) {
      console.log(error);
    }

    function deleteConversation() {
      let threadInfo = {
        thread_id: thread.threadId,
        user_id: parseInt(thread.user)
      };
      _messageDataService.deleteCurrentConversation(threadInfo, deleteConversationOnSuccessCallback, deleteConversationOnErrorCallback);
    }

    function addMessages(messages) {
      let add;

      setTimeout(() => {
        $scope.$apply(() => {
          let index = 0;
          let messageArray = [];
          setLoadMoreButton(messages.numChildren());
          messages.forEach((message) => {
            if (index === 0) {
              lastMessageId = message.key;
            }

            if (!checkExist(message.key)) {
              messageArray.push(message.val());
            }
            vm.messages = vm.messages.concat(messageArray);
            vm.messages = removeRepeatingValues(vm.messages);

            index++;
          });
        });
      }, 0);
    }

    function appendMessages(messages) {
      let add;

      setLoadMoreButton(messages.numChildren());

      setTimeout(() => {
        $scope.$apply(() => {
          let index = 0;
          let messageArray = [];
          setLoadMoreButton(messages.numChildren());
          messages.forEach((message) => {
            if (index === 0) {
              lastMessageId = message.key;
            }

            if (!checkExist(message.key)) {
              messageArray.push(message.val());
            }
            vm.messages = messageArray.concat(vm.messages);
            vm.messages = removeRepeatingValues(vm.messages);

            index++;
          });
        });
      }, 0);
    }

    function removeRepeatingValues(array) {
      let unique_array = Array.from(new Set(array));
      return unique_array;
    }

    function checkExist(key) {
      let index = vm.messages.findIndex(message => {
        return message.messageId === key;
      });

      return index === -1 ? false : true;
    }

    user = _messageDataService.getUser();
    thread = _messageDataService.getThread();
    vm.chatName = thread.displayName;

    if (thread.type === 'Private') {
      newMessage = _messageDataService.createNewPrivateMessage();
      _messageDataService.getMessages('one', user.userId, addMessages, messagesOnError);
      _messageDataService.getNewMessage('one', user.userId, onNewMessageSuccess);
    } else if (thread.type === 'Group') {
      _messageDataService.getGroupFromIdForGroup(thread.groupId, getGroupFromIdForGroupSuccessCallback);
      _messageDataService.createNewGroupMessage(createNewGroupMessageOnSuccess, createNewGroupMessageOnError);
      _messageDataService.getMessages('group', user.userId, addMessages, messagesOnError);
      _messageDataService.getNewMessage('group', user.userId, onNewMessageSuccess);
    } else {
      newMessage = _messageDataService.createNewHelpDeskMessage();
      vm.chatName = "Help Desk";
      _messageDataService.getMessages('help', user.userId, addMessages, messagesOnError);
      _messageDataService.getNewMessage('help', user.userId, onNewMessageSuccess);
    }
  }
})();
