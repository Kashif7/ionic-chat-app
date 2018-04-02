(function () {
  angular
    .module('practeraChat.chat')
    .controller('chatController', chatController);

  chatController.$inject = ['chatDataService', 'messageDataService', 'cookieManagerService'];

  function chatController(_chatDataService, _messageDataService, _cookieManagerService) {
    let vm = this;
    vm.threads = [];
    vm.helpDeskThreads = {};
    let userId = 1;
    let lastThreadId;

    vm.userType = _cookieManagerService.getLoginUserType();
    if (vm.userType === 'User') {
      _chatDataService.getThreads(_cookieManagerService.getLoginUserId(), threadsOnSuccess, threadsOnError);
      _chatDataService.getHelpdeskThreads(_cookieManagerService.getLoginUserId(), getHelpdeskThreadsOnSuccess, getHelpdeskThreadsOnError);
    } else {
      _chatDataService.getThreadsForAdmin(threadsOnSuccess, threadsOnError);
    }

    vm.getMessageTime = getMessageTime;
    // vm.setUnseenCount = setUnseenCount;
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

    function getHelpdeskThreadsOnSuccess(snapshot) {
      console.log("data", snapshot.val());
      vm.helpDeskThreads = snapshot.val();
    }

    function getHelpdeskThreadsOnError(error) {
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
