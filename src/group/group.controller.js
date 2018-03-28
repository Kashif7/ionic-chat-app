angular
  .module('practeraChat.group')
  .controller('groupController', groupController);

  groupController.$inject = ['groupDataService', 'cookieManagerService', 'messageDataService', '$location', '$ionicHistory'];

  function groupController(_groupDataService, _cookieManagerService, _messageDataService, $location, $ionicHistory) {
    let vm = this;
    vm.groups = [];
    let userId = 1;
    let lastgroupId;

    vm.goToBackView = goToBackView;

    if ($location.search()['type']) {
      vm.chatType = $location.search()['type'];

      let thread = _messageDataService.getThread();
      let group = _messageDataService.getGroupFromId(thread.groupId);
      let members;
      group.$loaded()
        .then((group) => {
          members = Object.keys(group.members);
        })
        .catch((error) => {
          console.log(error);
        });

    } else {
      _groupDataService.getGroups(_cookieManagerService.getLoginUserId(), threadsOnSuccess, threadsOnError);

      vm.setThread = (thread) => {
        _messageDataService.setThread(thread);
      };
    }

    function goToBackView() {
      $ionicHistory.goBack();
    }

    function loadOlderThreads() {
      vm.threads = _groupDataService.getOldGroups(_cookieManagerService.getLoginUserId(), lastThreadId, threadsOnSuccess,
        threadsOnError);
    }

    function threadsOnSuccess(data) {
      vm.groups = data;
    }

    function threadsOnError(error) {
      console.error('error', error);
    }
  }
