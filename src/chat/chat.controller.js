(function () {
  angular
    .module('practeraChat.chat')
    .controller('chatController', chatController);

  chatController.$inject = ['$scope', 'chatDataService', 'messageDataService', 'cookieManagerService', 'authService', 'firebaseService'];

  function chatController($scope, _chatDataService, _messageDataService, _cookieManagerService, _authService, _firebaseService) {
    let vm = this;
    vm.threads = [];
    vm.threadOb = {};
    let userId = 1;
    let lastThreadId;
    console.log('came to chat');

    _authService.updateToken();

    if (!window.cordova) {
      setTimeout(() => {
        _firebaseService.getToken();
      }, 1000);
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
      console.log(time, 'time');
      messageDay = new Date(time * 1000);
      console.log(messageDay, 'messageDay');
      messageDay = new Date(time);
      console.log(messageDay, 'message day 1');
      return messageDay;
    }

    function addConvos(threads) {
      add(threads);
    }

    function add(threads) {
      console.log(threads.val(), 'threads');
      let index = 0;
      vm.threads.length = 0;
      if (threads.numChildren() > 0) {
        threads.forEach((thread) => {

          setTimeout(() => {
            $scope.$apply(() => {
              vm.threads.push(thread.val());

              if (index === threads.numChildren() - 1) {
                vm.threads.sort(sort);
                console.log(vm.threads, 'ejgiogegegiehgeuh');
              }
            });
          }, 0);
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
