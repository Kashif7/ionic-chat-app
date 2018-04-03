(function () {
  angular
    .module('practeraChat.chat')
    .controller('chatController', chatController);

  chatController.$inject = ['$scope', 'chatDataService', 'messageDataService', 'cookieManagerService', 'authService', 'firebaseService', 'appService'];

  function chatController($scope, _chatDataService, _messageDataService, _cookieManagerService,  _authService, _firebaseService, _appService) {
    let vm = this;
    vm.threads = [];
    vm.threadOb = {};
    vm.helpDeskThreads = {};
    vm.isHelpDeskThreadsShow = false;
    vm.threadShearch = '';
    let userId = 1;
    let lastThreadId;

    vm.platformIsAndroid = ionic.Platform.isAndroid();

    _authService.updateToken();

    if (!window.cordova) {
      setTimeout(() => {
        _firebaseService.getToken();
      },1000);
    }

    vm.userType = _cookieManagerService.getLoginUserType();
    if (vm.userType === 'User') {
      _chatDataService.getThreads(_cookieManagerService.getLoginUserId(), addConvos, threadsOnError);
      _chatDataService.getHelpdeskThreads(_cookieManagerService.getLoginUserId(), getHelpdeskThreadsOnSuccess, getHelpdeskThreadsOnError);
    } else {
      _chatDataService.getThreadsForAdmin(addConvos, threadsOnError);
    }

    vm.getMessageTime = getMessageTime;
    vm.checkLoginUserType = checkLoginUserType;
    vm.setThread = (thread) => {
      _messageDataService.setThread(thread);
    };

    function checkLoginUserType() {
      return _appService.checkLoginUserTypeIsUser();
    }

    function helpDeskShow() {
      if (vm.helpDeskThreads && vm.userType === 'User') {
        vm.isHelpDeskThreadsShow = true;
      } else {
        vm.isHelpDeskThreadsShow = false;
      }
    }

    helpDeskShow();

    function loadOlderThreads() {
      _chatDataService.getOldThreads(_cookieManagerService.getLoginUserId(), lastThreadId, addConvos,
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
      vm.helpDeskThreads = snapshot.val();
      helpDeskShow();
    }

    function getHelpdeskThreadsOnError(error) {
      console.error('error', error);
    }

    let messageDay;

    function getMessageTime(time) {
      messageDay = new Date(time * 1000);
      messageDay = new Date(time);
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
      let index = 0;
      vm.threads.length = 0;
      if (threads.numChildren() > 0) {
        threads.forEach((thread) => {
          vm.threads.push(thread.val());

          if (index === threads.numChildren() - 1) {
            vm.threads.sort(sort);
          }
          index++;
        });
      }
    }

    function sort(a, b) {
      return parseInt(b.timeStamp) - parseInt(a.timeStamp);
    }
  }
})();
