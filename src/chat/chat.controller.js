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

    vm.threads = _chatDataService.getThreads(_cookieManagerService.getLoginUserId(), threadsOnSuccess, threadsOnError);

    vm.setThread = (thread) => {
      _messageDataService.setThread(thread);
    };

    function loadOlderThreads() {
      vm.threads = _chatDataService.getOldThreads(_cookieManagerService.getLoginUserId(), lastThreadId, threadsOnSuccess,
        threadsOnError);
    };

    function threadsOnSuccess(data) {
      console.log('data', data);
      vm.threads = data;
      lastThreadId = data[data.length-1].$id;
      console.log('lastThreadId',lastThreadId);
    }

    function threadsOnError(error) {
      console.error('error', error);
    }
  }
})();
