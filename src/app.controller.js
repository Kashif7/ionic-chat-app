/**
 * Created by sasangachathumal on 4/2/18.
 */
(function () {
  angular
    .module('practeraChat')
    .controller('appController', appController);

  appController.$inject = ['appService'];

  function appController(_appService) {
    let vm = this;
    vm.checkUserType = checkUserType;

    function checkUserType() {
      return _appService.checkLoginUserTypeIsUser();
    }

  }
})();
