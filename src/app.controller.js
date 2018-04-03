/**
 * Created by sasangachathumal on 4/2/18.
 */
(function () {
  angular
    .module('practeraChat')
    .controller('appController', appController);

  appController.$inject = ['cookieManagerService'];

  function appController(_cookieManagerService) {
    let vm = this;
    vm.checkUserType = checkUserType;

    function checkUserType() {
      let user = _cookieManagerService.getUserCookie();
      return user.user_type === 'User';
    }

  }
})();
