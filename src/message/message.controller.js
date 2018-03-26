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
      return senderId !== user.id ? 'item-avatar-left' : 'item-avatar-right';
    };

    vm.showAvatarImage = (senderId) => {
      return senderId !== user.id ? true : false;
    }

    vm.arrangeBubble = (senderId) => {
      return senderId === user.id ? 'bubbleRight' : 'bubbleLeft';
    };

    vm.sendMessage = () => {
      newMessage.text = vm.newMessageText;
      _messageDataService.sendMessage()
    };

    let user = {
      id: 1
    };
    let thread = {
      threadId: '1_2',
      user: '2',
      type: 'group',
      groupId: '-L8HJ3ldsi-SNLI7TUlM'
    };
    let threadId = 't_2'
    let lastMessageId;
    let newMessage = {};

    _messageDataService.getMessages(user.id, threadId, messagesOnSuccess, messagesOnError);

    function loadOlderMessages() {
      _messageDataService.getOldMessages(user.id, threadId, lastMessageId, messagesOnSuccess,
        messagesOnError);
    }

    function createNewMessage() {
      newMessage.threadId = thread.threadId;

      if (thread.type === 'private') {
        newMessage.recipent = thread.user;
      } else {
        let group = _messageDataService.getGroupFromId(thread.groupId);
        
        group.$loaded()
          .then((group) => {
            newMessage.recipent = Object.keys(group.members);
          })
          .catch((error) => {
            console.log(error);
          });
      }
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

    createNewMessage();
  }
})();
