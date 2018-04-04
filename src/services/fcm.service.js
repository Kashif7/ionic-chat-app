/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat')
    .factory('fcmFactory', fcmFactory);

  fcmFactory.$inject = ['authService', 'messageDataService', '$firebaseObject', '$firebaseArray', '$window', 'appService'];

  function fcmFactory(_authService, _messageDataService, $firebaseObject, $firebaseArray, $window, _appService) {
    return {
      getToken: getToken,
      refreshToken: refreshToken,
      onNotification: onNotification
    };

    function getToken(callback) {
      FCMPlugin.getToken(function (token) {
        console.log(token, 'token 0');
        localStorage.setItem('firebase_token', token);
        _authService.setToken(token);
       //  _authService.updateToken(token);
      });
    }

    function refreshToken() {
      FCMPlugin.onTokenRefresh(function (token) {
        localStorage.setItem('firebase_token', token);
        _authService.setToken(token);
        // _authService.updateToken(token);
      });
    }

    function onNotification() {
      FCMPlugin.onNotification(function (data) {
        console.log(data, 'sas das');
        console.log('notification');
        if (data.wasTapped) {
          let user = JSON.parse(localStorage.getItem('user'));
          let threadId = data.tag;
          let thread;

          let refString = `/threads/${user.id}/${threadId}`;
          let ref = firebase.database()
          .ref(refString);

        $firebaseObject(ref)
          .$loaded()
          .then((newThread) => {
            thread = newThread;
            _messageDataService.setThread(thread);
            $window.location.href = (`#/chat-messages?type=${thread.type}`);
          });
        } else {
          _appService.showNotification(data);
          //Notification was received in foreground. Maybe the user needs to be notified.
          console.log('notify');
        }
      });
    }
  }
})();
