/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat')
    .factory('cookieManagerService', cookieManagerService);

  cookieManagerService.$inject = ['$cookies'];

  function cookieManagerService($cookies) {

    return {
      setUserCookie: setUserCookie,
      getUserCookie: getUserCookie
    };

    function setUserCookie(user) {
      $cookies.putObject("user_", user);
    }

    function getUserCookie() {
      return $cookies.getObject("user_");
    }

  }
})();
