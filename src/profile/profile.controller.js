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

    vm.goToBackView = goToBackView;
    vm.imageSelecter = imageSelecter;

    if ($location.search()['type']) {
      vm.userForEdit = vm.user;
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
      alert("iydgsfh");
      document.getElementById(id).click();
    }

  }
})();
