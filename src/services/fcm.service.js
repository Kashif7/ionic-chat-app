/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat')
    .factory('fcmFactory', fcmFactory);

  fcmFactory.$inject = ['authService'];

  function fcmFactory(_authService) {
    return {
      getToken: getToken,
      refreshToken: refreshToken,
      onNotification: onNotification
    };

    function getToken(callback) {
      FCMPlugin.getToken(function (token) {
        _authService.updateToken(token);
      });
    }

    function refreshToken() {
      FCMPlugin.onTokenRefresh(function (token) {
        _authService.updateToken(token);
      });
    }

    function onNotification() {
      FCMPlugin.onNotification(function (data) {
        if (data.wasTapped) {
          //Notification was received on device tray and tapped by the user.
          // alert( JSON.stringify(data) );
          Notification.primary('Primary notification');

        } else {
          //Notification was received in foreground. Maybe the user needs to be notified.
          Notification.primary('Primary notification');
        }
      });
    }
  }
})();
