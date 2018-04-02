(function () {
  angular
    .module('practeraChat.chat')
    .controller('chatController', chatController);

  chatController.$inject = ['$scope', 'chatDataService', 'messageDataService', 'cookieManagerService', 'authService', 'firebaseService'];

  function chatController($scope, _chatDataService, _messageDataService, _cookieManagerService,  _authService, _firebaseService) {
    let vm = this;
    vm.threads = [];
    vm.threadOb = {};
    vm.helpDeskThreads = {};
    let userId = 1;
    let lastThreadId;

    _authService.updateToken();

    if (!window.cordova) {
      setTimeout(() => {
        _firebaseService.getToken();
      },1000);
    }

    vm.userType = _cookieManagerService.getLoginUserType();
    if (vm.userType === 'User') {
      _chatDataService.getThreads(_cookieManagerService.getLoginUserId(), threadsOnSuccess, threadsOnError);
      _chatDataService.getHelpdeskThreads(_cookieManagerService.getLoginUserId(), getHelpdeskThreadsOnSuccess, getHelpdeskThreadsOnError);
    } else {
      _chatDataService.getThreadsForAdmin(threadsOnSuccess, threadsOnError);
    }
    console.log(vm.threads, 'vm.threads');

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
      $scope.$apply(() => {
        if (data.length !== 0) {
          bubbleSort();
        }
      });
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
      console.log(time,'time');
      messageDay = new Date(time * 1000);
      console.log(messageDay, 'messageDay');
      messageDay = new Date(time);
      console.log(messageDay, 'message day 1');
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
