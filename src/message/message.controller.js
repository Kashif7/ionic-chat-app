(function () {
  angular
    .module('practeraChat.message')
    .controller('messageController', messageController);

  messageController.$inject = ['messageDataService'];

  function messageController(_messageDataService) {
    let vm = this;

    vm.messages = [];
    vm.newMessageText = '';

    vm.arrangeAvatar = (senderId) => {
      return senderId !== user.userId ? 'item-avatar-left' : 'item-avatar-right';
    };

    vm.showAvatarImage = (senderId) => {
      return senderId !== user.userId ? true : false;
    }

    vm.arrangeBubble = (senderId) => {
      return senderId === user.userId ? 'bubbleRight' : 'bubbleLeft';
    };

    vm.sendMessage = () => {
      newMessage.text = vm.newMessageText;
      _messageDataService.sendMessage()
    };

    let lastMessageId;
    let user;
    let newMessage = {};

    function loadOlderMessages() {
      _messageDataService.getOldMessages(user.userId , lastMessageId, messagesOnSuccess,
        messagesOnError);
    }

    // setTimeout(() => {
    //   loadOlderMessages();
    // }, 5000);

    function messagesOnSuccess(messages) {
      if (!vm.messages) {
        vm.messages = messages;
      } else {
        vm.messages = vm.messages.concat(messages);
      }
    }

    function messagesOnError(error) {
      console.error('error', error);
    }

    user = _messageDataService.getUser();
    console.log(user);
    newMessage = _messageDataService.createNewMessage();
    _messageDataService.getMessages(user.userId, messagesOnSuccess, messagesOnError);    
  }
})();
