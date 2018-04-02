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
      deleteUserCookie : deleteUserCookie,
      getLoginUserType: getLoginUserType
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
      console.log($cookies.getObject("user_"), 'vkdvijisn', $cookies.getObject("user_").id);
      if (!$cookies.getObject("user_")) {
        console.log('cookie eka naha');
        return JSON.parse(localStorage.getItem('user')).id;
      }
      return $cookies.getObject("user_").id;
    }

    function deleteUserCookie() {
      $cookies.remove("user_");
    }

    function getLoginUserType() {
      return $cookies.getObject("user_").user_type;
    }

  }
})();
