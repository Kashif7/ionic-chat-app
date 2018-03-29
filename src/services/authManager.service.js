/**
 * Created by sasangachathumal on 3/27/18.
 */
(function () {
  angular
    .module('practeraChat')
    .factory('authManagerService', authManagerService);

  authManagerService.$inject = ['cookieManagerService', '$state'];

  function authManagerService(_cookieManagerService, $state) {

    return {
      checkUserAlreadyLog : checkUserAlreadyLog
    };

    function checkUserAlreadyLog() {
      if (_cookieManagerService.setUserCookie()) {
        return true;
      } else {
        $state.go('login');
        return false;
      }
    }

  }
})();
