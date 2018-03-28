/**
 * Created by sasangachathumal on 3/27/18.
 */
(function () {
  angular
    .module('practeraChat.profile')
    .controller('profileController', profileController);

  profileController.$inject = ['authDataService', '$location', 'cookieManagerService', '$ionicHistory', 'profileService'];

  function profileController(_authDataService, $location, _cookieManagerService, $ionicHistory, _profileService) {
    let vm = this;

    vm.user = _cookieManagerService.getUserCookie();
    vm.userForEdit = {};
    vm.disableEditButton = true;

    vm.goToBackView = goToBackView;
    vm.imageSelecter = imageSelecter;
    vm.checkValueChange = checkValueChange;
    vm.updateSelfProfile = updateSelfProfile;

    if ($location.search()['type']) {
      vm.userForEdit = angular.copy(vm.user);
      console.log("user", vm.user);
      console.log("userForEdit", vm.userForEdit);
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
      let updateUser = {}
      updateUser.email = vm.userForEdit.email;
      updateUser.last_name = vm.userForEdit.last_name;
      updateUser.first_name = vm.userForEdit.first_name;
      updateUser.image_url = vm.userForEdit.image_url;
      _profileService.updateUserProfile(updateUser, vm.userForEdit.id, profileUpdateSuccessCallback, profileUpdateErrorCallback);
    }

  }
})();
