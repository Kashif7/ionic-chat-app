/**
 * Created by sasangachathumal on 3/27/18.
 */
(function () {
  angular
    .module('practeraChat.profile')
    .controller('profileController', profileController);

  profileController.$inject = ['$ionicModal', '$scope', '$location', 'cookieManagerService', '$ionicHistory', 'profileService'];

  function profileController($ionicModal, $scope, $location, _cookieManagerService, $ionicHistory, _profileService) {
    let vm = this;

    vm.user = _cookieManagerService.getUserCookie();
    vm.userForEdit = {};
    vm.disableEditButton = true;
    $scope.passwordChangeInfo = {};
    $scope.passwordChangeErrors = {
      emptyError: false,
      misMatchError: false
    };

    vm.goToBackView = goToBackView;
    vm.imageSelecter = imageSelecter;
    vm.checkValueChange = checkValueChange;
    vm.updateSelfProfile = updateSelfProfile;
    vm.openChangePasswordModal = openChangePasswordModal;
    vm.closeChangePasswordModal = closeChangePasswordModal;
    vm.changeUserPassword = changeUserPassword;

    $ionicModal.fromTemplateUrl('templates/profile/change-password.html', {
      controller: 'profileController',
      controllerAs: 'profileCtrl',
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
      vm.user = response.data.data['User'];
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
      console.log(response);
    }

    function profileUpdateErrorCallback(error) {
      console.log(error);
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

    }

    function changeUserPasswordOnErrorCallback(error) {

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

  }
})();
