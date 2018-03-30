(function () {
  angular
    .module('practeraChat.message')
    .controller('messageController', messageController);

  messageController.$inject = ['messageDataService', '$state', '$ionicPopover', '$ionicScrollDelegate', '$scope', '$location', '$ionicHistory'];

  function messageController(_messageDataService, $state, $ionicPopover, $ionicScrollDelegate, $scope, $location, $ionicHistory) {
    let vm = this;

    vm.chatType = $location.search()['type'];
    vm.messages = [];
    vm.newMessageText = '';
    vm.chatName = '';

    vm.arrangeAvatar = arrangeAvatar;
    vm.showAvatarImage = showAvatarImage;
    vm.arrangeBubble = arrangeBubble;
    vm.sendMessage = sendMessage;
    vm.loadOldMessages = loadOlderMessages;
    vm.listenForEnter = listenForEnter;
    vm.goToBackView = goToBackView;

    let lastMessageId;
    let user;
    let newMessage = {};
    let isLoaded;
    let thread;

    function goToBackView() {
      $state.go('nav.chat');
    }

    function arrangeAvatar(senderId) {
      return senderId != user.userId ? 'item-avatar-left' : 'item-avatar-right';
    }

    function showAvatarImage(senderId) {
      return senderId != user.userId ? true : false;
    }

    function arrangeBubble(senderId) {
      return senderId == user.userId ? 'bubbleRight' : 'bubbleLeft';
    }

    function sendMessage() {
      console.log(newMessage, 'newMessage');
      newMessage.text = vm.newMessageText;
      vm.newMessageText = '';
      _messageDataService.sendMessage(newMessage);
    }

    function loadOlderMessages() {
      isLoaded = true;
      _messageDataService.getOldMessages(user.userId, lastMessageId, messagesOnSuccess,
        messagesOnError);
    }

    function listenForEnter(event) {
      if (event.keyCode === 10 || event.keyCode === 13) {
        if (!event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      }
    }

    function messagesOnSuccess(messages) {

      if (messages.length > 0) {
        if (!vm.messages) {
          vm.messages = messages;
        } else {
          vm.messages = messages.concat(vm.messages.slice(1, vm.messages.length));
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
    }

    function messagesOnError(error) {
      console.error('error', error);
    }

    function onNewMessageSuccess(snapshot) {
      snapshot.forEach((childSnapShot) => {
        $scope.$apply(() => {
          pushNewMessage(childSnapShot);
        });
        $ionicScrollDelegate.scrollBottom();
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
      console.log(message, "message");
      newMessage = message;
    }

    function createNewGroupMessageOnError(error) {

    }

    user = _messageDataService.getUser();
    thread = _messageDataService.getThread();
    vm.chatName = thread.displayName;

    if (thread.type === 'Private') {
      newMessage = _messageDataService.createNewPrivateMessage();
    } else {
      _messageDataService.createNewGroupMessage(createNewGroupMessageOnSuccess, createNewGroupMessageOnError);
    }

    console.log(newMessage, "messagesOnSuccess");
    _messageDataService.getMessages(user.userId, messagesOnSuccess, messagesOnError);
    _messageDataService.getNewMessage(user.userId, onNewMessageSuccess);
  }
})();
