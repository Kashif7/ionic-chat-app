(function () {
  angular
    .module('practeraChat.message')
    .controller('messageController', messageController);

  messageController.$inject = ['messageDataService', '$ionicScrollDelegate', '$scope', '$location', '$ionicHistory'];

  function messageController(_messageDataService, $ionicScrollDelegate, $scope, $location, $ionicHistory) {
    let vm = this;

    vm.chatType = $location.search()['type'];
    vm.messages = [];
    vm.newMessageText = '';

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

    function goToBackView() {
      $ionicHistory.goBack();
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
        newMessage = _messageDataService.createNewMessage();
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
          if (findDuplicate(childSnapShot.key) === -1) {
            vm.messages.push(childSnapShot.val());
          }
        });
        $ionicScrollDelegate.scrollBottom();
      });
    }

    function findDuplicate(key) {
      return vm.messages.findIndex((element) => {
        return element.$id == key;
      });
    }

    user = _messageDataService.getUser();
    newMessage = _messageDataService.createNewMessage();
    _messageDataService.getMessages(user.userId, messagesOnSuccess, messagesOnError);
    _messageDataService.getNewMessage(user.userId, onNewMessageSuccess);
  }
})();
