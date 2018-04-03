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
      getUserCookie: getUserCookie,
      getLoginUserId: getLoginUserId,
      deleteUserCookie : deleteUserCookie
    };

    function setUserCookie(user) {
      let newUser = JSON.stringify(user);
      window.localStorage.setItem('user', newUser);
      $cookies.putObject("user_", user);
    }

    function getUserCookie() {
      if (!$cookies.getObject("user_")) {
        console.log('cookie eka naha');        
        return JSON.parse(localStorage.getItem('user'));
      }
      return $cookies.getObject("user_");
    }

    function getLoginUserId() {
      if (!$cookies.getObject("user_")) {
        console.log('cookie eka naha');
        return JSON.parse(localStorage.getItem('user')).id;
      }
      return $cookies.getObject("user_").id;
    }

    function deleteUserCookie() {
      $cookies.remove("user_");
    }

  }
})();
