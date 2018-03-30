(function () {
  angular
    .module('practeraChat.chat')
    .controller('chatController', chatController);

  chatController.$inject = ['chatDataService', 'messageDataService', 'cookieManagerService'];

  function chatController(_chatDataService, _messageDataService, _cookieManagerService) {
    let vm = this;
    vm.threads = [];
    let userId = 1;
    let lastThreadId;

    _chatDataService.getThreads(_cookieManagerService.getLoginUserId(), threadsOnSuccess, threadsOnError);

    vm.getMessageTime = getMessageTime;
    vm.setThread = (thread) => {
      _messageDataService.setThread(thread);
    };

    function loadOlderThreads() {
      _chatDataService.getOldThreads(_cookieManagerService.getLoginUserId(), lastThreadId, threadsOnSuccess,
        threadsOnError);
    };

    function threadsOnSuccess(data) {
      vm.threads = data;
      lastThreadId = data[data.length-1].$id;
    }

    function threadsOnError(error) {
      console.error('error', error);
    }

    let messageDay;

    function getMessageTime(time) {
      let newTime = time.substr(1);
      messageDay = new Date(newTime  * 1000);
      return messageDay;
    }

  }
})();
