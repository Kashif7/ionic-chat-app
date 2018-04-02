(function () {
  angular
    .module('practeraChat.chat')
    .controller('chatController', chatController);

  chatController.$inject = ['$scope', 'chatDataService', 'messageDataService', 'cookieManagerService', 'authService', 'firebaseService'];

  function chatController($scope, _chatDataService, _messageDataService, _cookieManagerService,  _authService, _firebaseService) {
    let vm = this;
    vm.threads = [];
    vm.threadOb = {};
    let userId = 1;
    let lastThreadId;

    _authService.updateToken();
    if (!window.cordova) {
      _firebaseService.getToken();
    }

    _chatDataService.getThreads(_cookieManagerService.getLoginUserId(), addConvos, threadsOnError);
    console.log(vm.threads, 'vm.threads');

    vm.getMessageTime = getMessageTime;
    vm.setThread = (thread) => {
      _messageDataService.setThread(thread);
    };

    function loadOlderThreads() {
      _chatDataService.getOldThreads(_cookieManagerService.getLoginUserId(), lastThreadId, threadsOnSuccess,
        threadsOnError);
    };

    function threadsOnSuccess(data) {
      $scope.$apply(() => {
        if (data.length !== 0) {
          bubbleSort();
        }
      });
    }

    function threadsOnError(error) {
      console.error('error', error);
    }

    let messageDay;

    function getMessageTime(time) {
      let newTime = time.substr(1);
      messageDay = new Date(newTime * 1000);
      return messageDay;
    }

    function addConvos(threads) {
      setTimeout(() => {
        $scope.$apply(() => {
          add(threads);
        });
      }, 0);
    }

    function add(threads) {
      console.log(threads.val(), 'threads');
      let index = 0;
      vm.threads.length = 0;
      if (threads.numChildren() > 0) {
        threads.forEach((thread) => {
          vm.threads.push(thread.val());

          if (index === threads.numChildren() - 1) {
            vm.threads.sort(sort);
            console.log(vm.threads, 'ejgiogegegiehgeuh');
          }
          index++;
        });
      }
    }

    function sort(a, b) {
      console.log(vm.threads, 'ijgijgu');
      return parseInt(b.timeStamp) - parseInt(a.timeStamp);
    }
  }
})();
