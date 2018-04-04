/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat')
    .factory('cordovaService', cordovaService);

  cordovaService.$inject = ['fcmFactory'];

  function cordovaService(FcmFactory) {

    return {
      initialize: initialize
    };

    function initialize() {
      document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    }

    function onDeviceReady() {
      FcmFactory.onNotification();
      FcmFactory.getToken(addUserApiCall);
    }

    function addUserApiCall(token) {
      console.log("hdjheuhe",token);
    }

    function onSuccess(success) {
      console.log(success, 'success');
    }

    function onError(error) {
      console.log(error, 'error');
    }

  }
})();
