/**
 * Created by sasangachathumal on 3/27/18.
 */
(function () {
  angular
    .module('practeraChat.profile')
    .controller('profileController', profileController);

  profileController.$inject = ['authDataService', '$state', 'cookieManagerService', '$ionicHistory'];

  function profileController(_authDataService, $state, _cookieManagerService, $ionicHistory) {
    let vm = this;

    vm.user = _cookieManagerService.getUserCookie();

    vm.goToBackView = goToBackView;

    function goToBackView() {
      $ionicHistory.goBack();
    }

  }
})();
