/**
 * Created by sasangachathumal on 3/26/18.
 */
(function () {
  angular
    .module('practeraChat.createChat')
    .controller('chatCreateController', chatCreateController);

  chatCreateController.$inject = ['$stateParams', '$window', 'authDataService', 'chatCreateService', 'messageDataService', 'cookieManagerService'];

  function chatCreateController($stateParams, $window, _authDataService, _chatCreateService , _messageDataService, _cookieManagerService) {
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
      let loginUserId = _cookieManagerService.getLoginUserId();
      let newChatData;
      for (var key in response.data[loginUserId]) {
        if (response.data[loginUserId].hasOwnProperty(key)) {
          newChatData = response.data[loginUserId][key];
        }
      }
      _messageDataService.setThread(newChatData);
      $window.location.href = ('#/chat-messages?type=' + newChatData.type);
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
