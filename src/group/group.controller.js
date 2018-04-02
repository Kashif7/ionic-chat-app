angular
  .module('practeraChat.group')
  .controller('groupController', groupController);

groupController.$inject = ['chatCreateService', 'groupDataService', '$state', '$scope', '$ionicPopup', 'cookieManagerService', 'messageDataService', '$location', '$window'];

function groupController(_chatCreateService, _groupDataService, $state, $scope, $ionicPopup, _cookieManagerService, _messageDataService, $location, $window) {
  let vm = this;
  vm.groups = [];
  vm.groupMembersProfiles = [];
  vm.currentGroup = {};
  let userId = 1;
  let lastgroupId;
  let groupMembersId;
  $scope.groupData = {};

  vm.goToBackView = goToBackView;
  vm.editGroupNamePopup = editGroupNamePopup;
  vm.removeMemberFromGroup = removeMemberFromGroup;
  vm.checkMyProfile = checkMyProfile;
  vm.leaveGroup = leaveGroup;

  function getGroupDataFromIdCallback(snapshot) {
    let groupInfo = snapshot.val();
    _chatCreateService.setGroupData(groupInfo);
    vm.currentGroup = groupInfo;
    $scope.groupData = groupInfo;
    groupMembersId = Object.keys(groupInfo.members).map(Number);
    loadGroupMembers();
  }

  if ($location.search()['type']) {
    vm.chatType = $location.search()['type'];

    let thread = _messageDataService.getThread();
    _messageDataService.getGroupFromIdForGroup(thread.groupId, getGroupDataFromIdCallback);

  } else {
    _groupDataService.getGroups(_cookieManagerService.getLoginUserId(), addConvos, threadsOnError);

    vm.setThread = (thread) => {
      _messageDataService.setThread(thread);
    };
  }

  function addConvos(threads) {
    setTimeout(() => {
      $scope.$apply(() => {
        add(threads);
      });
    },0); 
  }

  function add(groups) {
    let index = 0;
    vm.groups.length = 0;
    if (groups.numChildren() > 0) {
      groups.forEach((group) => {
        vm.groups.push(group.val());

        if (index === groups.numChildren() - 1) {
          vm.groups.sort(sort);
        }
        index++;
      });
    }
  }

  function sort(a, b) {
    return parseInt(b.timeStamp) - parseInt(a.timeStamp);
  }

  function loadGroupMembersOnSuccessCallback(response) {
    vm.groupMembersProfiles = response.data.data;
  }

  function loadGroupMembersOnErrorCallback(error) {
    console.log(error);
  }

  function loadGroupMembers() {
    let groupMembers = {
      ids: groupMembersId
    };
    _groupDataService.getGroupMembers(groupMembers, loadGroupMembersOnSuccessCallback, loadGroupMembersOnErrorCallback);
  }

  function goToBackView() {
    $window.location.href = ('#/chat-messages?type=Group');
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

  function editGroupNamePopup() {
    $scope.editGroupInfo = {
      name: angular.copy($scope.groupData.name)
    };
    let groupNamePopup = $ionicPopup.show({
      template: '<div class="practera-forms-group"><input type="text" placeholder="Group Name" ng-model="editGroupInfo.name"></div>',
      title: 'Change Group Name',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: 'Save',
          type: 'button-calm',
          onTap: function (e) {
            if (!$scope.editGroupInfo.name) {
              e.preventDefault();
            } else if (angular.equals($scope.editGroupInfo.name, $scope.groupData.name)) {
              e.preventDefault();
            } else {
              return $scope.editGroupInfo.name;
            }
          }
        }
      ]
    });

    groupNamePopup.then(function (res) {
      updateGroupName(res);
    });

  }

  function updateGroupNameOnSuccessCallback(response) {
    console.log("response", response);
  }

  function updateGroupNameOnErrorCallback(error) {
    console.log("error", error);
  }

  function updateGroupName(name) {
    let groupData = {
      group_id: $scope.groupData.groupId,
      name: name
    };
    _groupDataService.UpdateGroupNameOrImage(groupData, updateGroupNameOnSuccessCallback, updateGroupNameOnErrorCallback);
  }

  function removeMemberFromGroupOnSuccess(response) {
    console.log("remove success", response);
  }

  function removeMemberFromGroupOnError(error) {
    console.log("remove fail", error);
  }

  function removeMemberFromGroup(memberId) {
    let groupMembers = vm.currentGroup.members;
    if (groupMembers.hasOwnProperty(memberId)) {
      delete groupMembers[memberId];
    }

    let groupNewData = {
      group_id: vm.currentGroup.groupId,
      removed_user_id: memberId,
      members: groupMembers
    };

    _groupDataService.removeGroupMembers(groupNewData, removeMemberFromGroupOnSuccess, removeMemberFromGroupOnError);

  }

  function checkMyProfile(id) {
    return _cookieManagerService.getLoginUserId() === id;
  }

  function leaveGroupOnSuccessCallback(response) {

  }

  function leaveGroupOnErrorCallback(error) {
    console.log(error);
  }

  function leaveGroup() {

    var confirmPopup = $ionicPopup.confirm({
      title: 'Leave Group?',
      template: 'You will no longer be able to send or receive new messages'
    });
    confirmPopup.then(function(res) {
      if(res) {
        let members = vm.currentGroup.members;
        if (members.hasOwnProperty(_cookieManagerService.getLoginUserId())) {
          delete members[_cookieManagerService.getLoginUserId()];
        }
        let groupData = {
          group_id: vm.currentGroup.groupId,
          members: members
        };

        _groupDataService.leaveFromGroup(groupData, leaveGroupOnSuccessCallback, leaveGroupOnErrorCallback);
        $state.go('nav.chat');
      } else {
        console.log('You are not sure');
      }
    });
  }

}
