(function () {
  angular
    .module('practeraChat.chat')
    .controller('chatController', chatController);

  chatController.$inject = ['chatDataService'];

  function chatController(_chatDataService) {
    let vm = this;
    vm.threads = [];
    let userId = 1;
    let lastThreadId;

    vm.threads = _chatDataService.getThreads(1, threadsOnSuccess, threadsOnError);

    function loadOlderThreads() {
      vm.threads = _chatDataService.getOldThreads(1, lastThreadId, threadsOnSuccess,
        threadsOnError);
    };

    // setTimeout(() => {
    //   loadOlderThreads();
    // }, 5000);

    function threadsOnSuccess(data) {
      console.log('data', data);
      vm.threads = data;
      lastThreadId = data[2].$id;
      console.log('lastThreadId',lastThreadId);
    }

    function threadsOnError(error) {
      console.error('error', error);
    }
  }
})();
