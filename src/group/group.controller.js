angular
  .module('practeraChat.group')
  .controller('groupController', groupController);
  
  groupController.$inject = ['groupDataService'];

  function groupController(_groupDataService) {
    let vm = this;
    vm.groups = [];
    let userId = 1;
    let lastgroupId;

    _groupDataService.getGroups(1, threadsOnSuccess, threadsOnError);

    function loadOlderThreads() {
      vm.threads = _groupDataService.getOldGroups(1, lastThreadId, threadsOnSuccess,
        threadsOnError);
    };

    function threadsOnSuccess(data) {
      vm.groups = data;
    }

    function threadsOnError(error) {
      console.error('error', error);
    }
  }