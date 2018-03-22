(function () {
  angular
    .module('practeraChat.chat')
    .controller('chatController', chatController);

  chatController.$inject = ['$scope', 'chatDataService', '$firebaseObject'];

  function chatController($scope, _chatDataService, $firebaseObject) {
    let vm = this;
    vm.threads = [];
    let userId = 1;
    let lastThreadId;

    vm.threads = _chatDataService.getThreads(1, threadsOnSuccess, threadsOnError);

    function loadOlderThreads() {
      vm.threads = _chatDataService.getOldThreads(2, lastThreadId, threadsOnSuccess,
        threadsOnError);
    };

    setTimeout(() => {
      loadOlderThreads();
    }, 3000);

    function threadsOnSuccess(data) {
      vm.threads = data;
      lastThreadId = data[0].$id;

      console.log('lastThreadId', lastThreadId);
    }

    function threadsOnError(data) {
      vm.threads = data;
      lastThreadId = data[0].$id;

      console.log('lastThreadId', lastThreadId);
    }
  }
})();
