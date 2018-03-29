angular
  .module('practeraChat.group')
  .controller('groupController', groupController);

groupController.$inject = ['groupDataService', '$scope', '$ionicPopup', 'cookieManagerService', 'messageDataService', '$location', '$ionicHistory'];

function groupController(_groupDataService, $scope, $ionicPopup, _cookieManagerService, _messageDataService, $location, $ionicHistory) {
  let vm = this;
  vm.groups = [];
  vm.groupMembersProfiles = [];
  let userId = 1;
  let lastgroupId;
  let groupMembersId;
  $scope.groupData = {};

  vm.goToBackView = goToBackView;
  vm.editGroupNamePopup = editGroupNamePopup;

  if ($location.search()['type']) {
    vm.chatType = $location.search()['type'];

    let thread = _messageDataService.getThread();
    let group = _messageDataService.getGroupFromId(thread.groupId);
    group.$loaded()
      .then((group) => {
        $scope.groupData = group;
        groupMembersId = Object.keys(group.members).map(Number);
        loadGroupMembers();
      })
      .catch((error) => {
        console.log(error);
      });

  } else {
    _groupDataService.getGroups(_cookieManagerService.getLoginUserId(), threadsOnSuccess, threadsOnError);

    vm.setThread = (thread) => {
      _messageDataService.setThread(thread);
    };
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
    $ionicHistory.goBack();
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

}
