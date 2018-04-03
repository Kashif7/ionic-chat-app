/**
 * Created by sasangachathumal on 3/27/18.
 */
(function () {
  angular
    .module('practeraChat.profile')
    .controller('profileController', profileController);

  profileController.$inject = ['$ionicModal', '$state', '$scope', '$location', 'cookieManagerService', '$ionicHistory', 'profileService', 'authDataService'];

  function profileController($ionicModal, $state, $scope, $location, _cookieManagerService, $ionicHistory, _profileService, _authDataService) {
    let vm = this;

    vm.user = _cookieManagerService.getUserCookie();
    vm.userForEdit = {};
    vm.disableEditButton = true;
    vm.profileUpdateSuccessStatus = false;
    vm.profileUpdateErrorStatus = false;
    $scope.passwordChangeInfo = {};
    $scope.passwordChangeErrors = {
      emptyError: false,
      misMatchError: false,
      changeSuccess: false
    };

    vm.goToBackView = goToBackView;
    vm.imageSelecter = imageSelecter;
    vm.checkValueChange = checkValueChange;
    vm.updateSelfProfile = updateSelfProfile;
    vm.openChangePasswordModal = openChangePasswordModal;
    vm.closeChangePasswordModal = closeChangePasswordModal;
    vm.changeUserPassword = changeUserPassword;
    vm.userLogOut = userLogOut;
    vm.removeProfileUpdateMessage = removeProfileUpdateMessage;

    $scope.closeChangePasswordModal = closeChangePasswordModal;
    $scope.changeUserPassword = changeUserPassword;
    $scope.removeProfileUpdateMessage = removeProfileUpdateMessage;

    $ionicModal.fromTemplateUrl('templates/profile/change-password.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    if ($location.search()['type']) {
      vm.userForEdit = angular.copy(vm.user);
    } else {
      activate();
    }

    function getProfileOnSuccessCallback(response) {
      vm.user = response.data.data;
      _profileService.setUserProfile(vm.user);
    }

    function getProfileOnErrorCallback(error) {
      console.error(error);
    }

    function activate() {
      _profileService.getMyProfile(getProfileOnSuccessCallback, getProfileOnErrorCallback);
    }

    function goToBackView() {
      $ionicHistory.goBack();
    }

    function imageSelecter(id) {
      document.getElementById(id).click();
    }

    function checkValueChange(e) {
      var charCode = (e.which) ? e.which : e.keyCode;
      if(angular.equals(vm.user, vm.userForEdit)) {
        vm.disableEditButton = true;
      } else {
        vm.disableEditButton = false;
      }
    }

    function profileUpdateSuccessCallback(response) {
      vm.profileUpdateSuccessStatus = true;
      vm.profileUpdateErrorStatus = false;
      vm.userForEdit = response.data.data;
      _cookieManagerService.setUserCookie(response.data.data);
      vm.user = _cookieManagerService.getUserCookie();
      setTimeout(() => {
        removeProfileUpdateMessage();
      }, 3000);
      console.log(response);
    }

    function profileUpdateErrorCallback(error) {
      vm.profileUpdateSuccessStatus = false;
      vm.profileUpdateErrorStatus = true;
      setTimeout(() => {
        removeProfileUpdateMessage();
      }, 3000);
      console.log(error);
    }

    function removeProfileUpdateMessage() {
      vm.profileUpdateSuccessStatus = false;
      vm.profileUpdateErrorStatus = false;
      $scope.passwordChangeErrors = {
        emptyError: false,
        misMatchError: false,
        changeSuccess: false
      };
    }

    function updateSelfProfile() {
      let updateUser = {};
      updateUser.email = vm.userForEdit.email;
      updateUser.last_name = vm.userForEdit.last_name;
      updateUser.first_name = vm.userForEdit.first_name;
      updateUser.image_url = vm.userForEdit.image_url;
      _profileService.updateUserProfile(updateUser, profileUpdateSuccessCallback, profileUpdateErrorCallback);
    }

    function openChangePasswordModal() {
      $scope.modal.show();
    }

    function closeChangePasswordModal() {
      $scope.passwordChangeInfo = {};
      $scope.passwordChangeErrors = {
        emptyError: false,
        misMatchError: false,
        changeSuccess: false
      };
      $scope.modal.hide();
    }
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    function changeUserPasswordOnSuccessCallback(response) {
      $scope.passwordChangeInfo = {};
      $scope.passwordChangeErrors = {
        emptyError: false,
        misMatchError: false,
        changeSuccess: true
      };
      vm.userForEdit = response.data.data;
      _cookieManagerService.setUserCookie(response.data.data);
      vm.user = _cookieManagerService.getUserCookie();
      setTimeout(() => {
        removeProfileUpdateMessage();
      }, 3000);
      console.log(response);
    }

    function changeUserPasswordOnErrorCallback(error) {
      console.log(error);
    }

    function changeUserPassword() {
      console.log($scope.passwordChangeInfo.currentPass, $scope.passwordChangeInfo.newPass, $scope.passwordChangeInfo.newPassConform);
      if (!$scope.passwordChangeInfo.currentPass || !$scope.passwordChangeInfo.newPass || !$scope.passwordChangeInfo.newPassConform) {
        $scope.passwordChangeErrors.emptyError = true;
      } else if (!angular.equals($scope.passwordChangeInfo.newPass, $scope.passwordChangeInfo.newPassConform)) {
        $scope.passwordChangeErrors.misMatchError = true;
      } else {
        let passwordObject = {};
        passwordObject.password = $scope.passwordChangeInfo.newPassConform;
        _profileService.updateUserProfile(passwordObject, changeUserPasswordOnSuccessCallback, changeUserPasswordOnErrorCallback);
      }

    }

    function userLogOutOnSuccessCallback(response) {
      console.log(response);
      _cookieManagerService.deleteUserCookie();
      $state.go('login');
    }

    function userLogOutOnErrorCallback(error) {
      _cookieManagerService.deleteUserCookie();
      $state.go('login');
      console.log(error);
    }

    function userLogOut() {
      _authDataService.signOut(userLogOutOnSuccessCallback, userLogOutOnErrorCallback);
    }

  }
})();
