/**
 * Created by sasangachathumal on 3/26/18.
 */
(function () {
  angular
    .module('practeraChat.createChat')
    .controller('chatCreateController', chatCreateController);

  chatCreateController.$inject = ['$stateParams', '$ionicHistory', '$window', 'authDataService', 'chatCreateService', 'messageDataService', 'cookieManagerService'];

  function chatCreateController($stateParams, $ionicHistory, $window, _authDataService, _chatCreateService , _messageDataService, _cookieManagerService) {
    let vm = this;
    vm.view = $stateParams.viewName;
    vm.contactList = [];

    vm.createNormalChat = createNormalChat;
    vm.selectOrUnselectUser = selectOrUnSelectUser;
    vm.checkHasMembers = checkHasMembers;
    vm.createGroupChat = createGroupChat;
    vm.goToBackView = goToBackView;

    if (vm.view === 'one2one' || vm.view === 'group') {
      activate();
    } else {
      // add users to existing group
    }

    let chatMembers = {};

    function selectOrUnSelectUser(index) {
      if (chatMembers.hasOwnProperty(vm.contactList[index].id)) {
        delete chatMembers[vm.contactList[index].id];
      } else {
        chatMembers[vm.contactList[index].id] = "member";
      }
    }

    function goToBackView() {
      $ionicHistory.goBack();
    }

    function checkHasMembers() {
      return angular.equals(chatMembers, {});
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
      let chatdata = {
        user_id: id
      };
      _chatCreateService.createNormalChat(chatdata, normalChatCreateSuccessCallback, normalChatCreateErrorCallback);
    }

    function groupChatCreateSuccessCallback(response) {
      console.log(response.data);
      console.log(response);
    }

    function groupChatCreateErrorCallback(error) {

    }

    function createGroupChat() {
      let chatData = {
        members: chatMembers
      };
      _chatCreateService.createGroupChat(chatData, groupChatCreateSuccessCallback, groupChatCreateErrorCallback);
    }

  }
})();
