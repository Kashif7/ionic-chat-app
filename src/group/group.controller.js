angular
  .module('practeraChat.group')
  .controller('groupController', groupController);

  groupController.$inject = ['groupDataService', 'cookieManagerService', 'messageDataService'];

  function groupController(_groupDataService, _cookieManagerService, _messageDataService) {
    let vm = this;
    vm.groups = [];
    let userId = 1;
    let lastgroupId;

    _groupDataService.getGroups(_cookieManagerService.getLoginUserId(), threadsOnSuccess, threadsOnError);

    vm.setThread = (thread) => {
      _messageDataService.setThread(thread);
    };

    function loadOlderThreads() {
      vm.threads = _groupDataService.getOldGroups(_cookieManagerService.getLoginUserId(), lastThreadId, threadsOnSuccess,
        threadsOnError);
    };

    function threadsOnSuccess(data) {
      vm.groups = data;
    }

    function threadsOnError(error) {
      console.error('error', error);
    }
  }
