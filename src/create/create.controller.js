/**
 * Created by sasangachathumal on 3/26/18.
 */
(function () {
  angular
    .module('practeraChat.createChat')
    .controller('chatCreateController', chatCreateController);

  chatCreateController.$inject = ['$stateParams', '$scope', '$ionicHistory', '$ionicPopup', '$window', 'authDataService', 'chatCreateService', 'messageDataService', 'cookieManagerService'];

  function chatCreateController($stateParams, $scope, $ionicHistory, $ionicPopup, $window, _authDataService, _chatCreateService , _messageDataService, _cookieManagerService) {
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
    let loginUserId = _cookieManagerService.getLoginUserId();

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
      let newChatData;
      for (var key in response.data['threads'][loginUserId]) {
        if (response.data['threads'][loginUserId].hasOwnProperty(key)) {
          newChatData = response.data['threads'][loginUserId][key];
        }
      }
      _messageDataService.setThread(newChatData);
      $window.location.href = ('#/chat-messages?type=' + newChatData.type);
    }

    function groupChatCreateErrorCallback(error) {

    }

    function createGroupChat() {

      $scope.groupInfo = {};

      let groupNamePopup = $ionicPopup.show({
        template: '<input type="text" required ng-model="groupInfo.name">',
        title: 'Enter Group Name',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: 'Save',
            type: 'button-clear button-calm',
            onTap: function(e) {
              if (!$scope.groupInfo.name) {
                e.preventDefault();
              } else {
                return $scope.groupInfo.name;
              }
            }
          }
        ]
      });

      groupNamePopup.then(function(res) {
        if (res) {
          chatMembers[loginUserId] = "admin";
          let chatData = {
            members: chatMembers,
            name: res
          };
          _chatCreateService.createGroupChat(chatData, groupChatCreateSuccessCallback, groupChatCreateErrorCallback);
        }
      });
    }

  }
})();
