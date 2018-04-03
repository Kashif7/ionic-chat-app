/**
 * Created by sasangachathumal on 3/26/18.
 */
(function () {
  angular
    .module('practeraChat.createChat')
    .controller('chatCreateController', chatCreateController);

  chatCreateController.$inject = ['$stateParams', '$scope', '$ionicBackdrop', '$ionicHistory', '$ionicPopup', '$window', 'authDataService', 'chatCreateService', 'messageDataService', 'cookieManagerService', 'groupDataService'];

  function chatCreateController($stateParams, $scope, $ionicBackdrop, $ionicHistory, $ionicPopup, $window, _authDataService, _chatCreateService , _messageDataService, _cookieManagerService, _groupDataService) {
    let vm = this;
    vm.view = $stateParams.viewName;
    vm.contactList = [];
    vm.saveButtonText = 'Done';
    vm.viewTitle = 'Create Chat';
    vm.contactShearch = '';

    vm.createNormalChat = createNormalChat;
    vm.selectOrUnselectUser = selectOrUnSelectUser;
    vm.checkHasMembers = checkHasMembers;
    vm.createGroupChat = createGroupChat;
    vm.goToBackView = goToBackView;
    vm.createChatWithHelpdesk = createChatWithHelpdesk;

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

    $scope.$on('backdrop.hidden', function() {
      $ionicBackdrop.release();
    });

    function filterMembers(response) {
      let list = response;
      var lastChar = '';
      for(var i=0,len=list.length; i<len; i++) {
        var item = list[i];

        if(item.first_name.charAt(0).toUpperCase() != lastChar.toUpperCase()) {
          vm.contactList.push({name:item.first_name.charAt(0).toUpperCase(),letter:true});
          lastChar = item.first_name.charAt(0).toUpperCase();
        }
        vm.contactList.push(item);
      }
    }

    function activateMemberAddOnSuccess(response) {
      filterMembers(response);
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
      filterMembers(response);
      // vm.contactList = response;
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
      console.log("create group", response);
      let newChatData;
      for (var key in response.data['threads'][loginUserId]) {
        if (response.data['threads'][loginUserId].hasOwnProperty(key)) {
          newChatData = response.data['threads'][loginUserId][key];
        }
      }
      _messageDataService.setThread(newChatData);
      $ionicBackdrop.release();
      $window.location.href = ('#/chat-messages?type=' + newChatData.type);
    }

    function groupChatCreateErrorCallback(error) {
      console.log(error);
    }

    function addGroupMembersOnSuccess(response) {
      $ionicBackdrop.release();
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
            $ionicBackdrop.retain();
            chatMembers[loginUserId] = "admin";
            let chatData = {
              members: chatMembers,
              name: res
            };
            _chatCreateService.createGroupChat(chatData, groupChatCreateSuccessCallback, groupChatCreateErrorCallback);
          }
        });
      } else {
        $ionicBackdrop.retain();
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

    function createChatWithHelpdeskOnSuccessCallback(response) {
      let newChatData = response.data['threads']['helpDesk'][loginUserId];
      // for (var key in response.data[loginUserId]) {
      //   if (response.data[loginUserId].hasOwnProperty(key)) {
      //     newChatData = response.data[loginUserId][key];
      //   }
      // }
      _messageDataService.setThread(newChatData);
      $window.location.href = ('#/chat-messages?type=' + newChatData.type);
    }

    function createChatWithHelpdeskOnErrorCallback(error) {

    }

    function createChatWithHelpdesk() {
      _chatCreateService.createChatHelpdesk(createChatWithHelpdeskOnSuccessCallback, createChatWithHelpdeskOnErrorCallback);
    }

  }
})();
