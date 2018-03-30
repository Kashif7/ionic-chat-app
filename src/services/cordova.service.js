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
      console.log("fjefjefefue");
      document.addEventListener('deviceready',onDeviceReady.bind(this), false);
    }

    function onDeviceReady() {
      alert("hdjheuhe");
      console.log("hdjheuhe");
      FcmFactory.onNotification();
      FcmFactory.getToken(addUserApiCall);
    }

    function addUserApiCall(token) {
      alert(token);
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
