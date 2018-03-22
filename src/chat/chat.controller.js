(function () {
  angular
    .module('practeraChat.chat')
    .controller('chatController', chatController);

  chatController.$inject = ['$scope', 'chatDataService'];

  function chatController($scope, _chatDataService) {
    let vm = this;
    vm.threads = [];
    vm.items = _chatDataService.all();

    _chatDataService.getThreads(1, loadThreads);

    function loadThreads(snapshot) {
      vm.threads = snapshot.val();
    }
  }
})();
