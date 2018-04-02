/**
 * Created by sasangachathumal on 3/26/18.
 */
(function () {
  angular
    .module('practeraChat.createChat')
    .controller('chatCreateController', chatCreateController);

  chatCreateController.$inject = ['$stateParams', '$scope', '$ionicHistory', '$ionicPopup', '$window', 'authDataService', 'chatCreateService', 'messageDataService', 'cookieManagerService', 'groupDataService'];

  function chatCreateController($stateParams, $scope, $ionicHistory, $ionicPopup, $window, _authDataService, _chatCreateService , _messageDataService, _cookieManagerService, _groupDataService) {
    let vm = this;
    vm.view = $stateParams.viewName;
    vm.contactList = [];
    vm.saveButtonText = 'Done';
    vm.viewTitle = 'Create Chat';

    vm.createNormalChat = createNormalChat;
    vm.selectOrUnselectUser = selectOrUnSelectUser;
    vm.checkHasMembers = checkHasMembers;
    vm.createGroupChat = createGroupChat;
    vm.goToBackView = goToBackView;

    let chatMembers = {};
    let loginUserId = _cookieManagerService.getLoginUserId();
    let groupData = {};
    let groupMembersId;

    if (vm.view === 'one2one') {
      vm.viewTitle = 'Create Chat';
    } else if (vm.view === 'group') {
      vm.viewTitle = 'Create Group';
    } else {
      vm.viewTitle = 'Add Members';
    }

    if (vm.view === 'one2one' || vm.view === 'group') {
      activate();
      vm.saveButtonText = 'Done';
    } else {
      // add users to existing group
      vm.saveButtonText = 'Add';
      groupData = _chatCreateService.getGroupData();
      groupMembersId = Object.keys(groupData.members).map(Number);
      activateMemberAdd(groupMembersId);
    }

    function activateMemberAddOnSuccess(response) {
      vm.contactList = response;
      console.log("response", response);
    }

    function activateMemberAddOnError(error) {
      console.log(error);
    }

    function activateMemberAdd(groupMembers) {
      let requestData = {
        ids: groupMembers
      };
      _authDataService.userListForAddMemberToGroup(requestData, activateMemberAddOnSuccess, activateMemberAddOnError);
    }

    function selectOrUnSelectUser(index) {
      if (chatMembers.hasOwnProperty(vm.contactList[index].id)) {
        delete chatMembers[vm.contactList[index].id];
        vm.contactList[index].active = false;
      } else {
        chatMembers[vm.contactList[index].id] = "member";
        vm.contactList[index].active = true;
      }
    }

    function goToBackView() {
      $ionicHistory.goBack();
    }

    function checkHasMembers() {
      return angular.equals(chatMembers, {});
    }

    function userListOnSuccessCallback(response) {
      vm.contactList = response;
      console.log("response", response);
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
      console.log(error);
    }

    function addGroupMembersOnSuccess(response) {
      $ionicHistory.goBack();
    }

    function addGroupMembersOnError(error) {
      console.log(error);
    }

    function createGroupChat() {

      if (vm.view !== 'groupInfo') {
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
      } else {
        let allMembers  = angular.extend({}, chatMembers, groupData.members);
        console.log("groupData", groupData);
        let tempGroupInfo = {
          thread_id: groupData.groupId,
          name: groupData.name,
          user_ids: Object.keys(chatMembers).map(Number),
          members: allMembers
        };

        console.log("tempGroupInfo", tempGroupInfo);

        _groupDataService.addGroupMembers(tempGroupInfo, addGroupMembersOnSuccess, addGroupMembersOnError);

      }
    }

  }
})();
