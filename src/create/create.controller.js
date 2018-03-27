/**
 * Created by sasangachathumal on 3/26/18.
 */
(function () {
  angular
    .module('practeraChat.createChat')
    .controller('chatCreateController', chatCreateController);

  chatCreateController.$inject = ['$stateParams', 'authDataService', 'chatCreateService'];

  function chatCreateController($stateParams, _authDataService, _chatCreateService) {
    let vm = this;
    vm.view = $stateParams.viewName;
    vm.contactList = [];

    vm.createNormalChat = createNormalChat;

    if (vm.view === 'one2one' || vm.view === 'group') {
      activate();
    } else {
      // add users to existing group
    }

    function userListOnSuccessCallback(response) {
      vm.contactList = response.data.data;
      console.log(vm.contactList);
    }

    function userListOnErrorCallback(error) {

    }

    function activate() {
      _authDataService.getUserList(userListOnSuccessCallback, userListOnErrorCallback);
    }

    function normalChatCreateSuccessCallback(response) {

    }

    function normalChatCreateErrorCallback(error) {

    }

    function createNormalChat(id) {
      alert("create chat");
      let chatdata = {
        user_id: id
      };

      _chatCreateService.createNormalChat(chatdata, normalChatCreateSuccessCallback, normalChatCreateErrorCallback);
    }

  }
})();
