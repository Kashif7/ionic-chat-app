/**
 * Created by sasangachathumal on 4/2/18.
 */
(function () {
  angular
    .module('practeraChat')
    .factory('appService', appService);

  appService.$inject = ['cookieManagerService'];

  function appService(_cookieManagerService) {

    return {
      checkLoginUserTypeIsUser: checkLoginUserTypeIsUser
    };

    function checkLoginUserTypeIsUser() {
      let user = _cookieManagerService.getUserCookie();
      return user.user_type === 'User';
    }

  }
})();
