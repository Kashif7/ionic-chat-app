/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat')
    .factory('fcmFactory', fcmFactory);

  fcmFactory.$inject = ['authService', 'messageDataService', '$firebaseObject', '$firebaseArray', '$window'];

  function fcmFactory(_authService, _messageDataService, $firebaseObject, $firebaseArray, $window) {
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
        _authService.setToken(token);        
        // _authService.updateToken(token);
      });
    }

    function onNotification() {
      FCMPlugin.onNotification(function (data) {
        alert(data);
        console.log(data, 'sas das');
        console.log('notification');
        if (data.wasTapped) {
          alert(data);
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
            console.log(thread);
            _messageDataService.setThread(thread);
            $window.location.href = (`#/chat-messages?type=${thread.type}`);
          })
          .catch(errorCallback);
        } else {
          //Notification was received in foreground. Maybe the user needs to be notified.
          alert('notified');
        }
      });
    }
  }
})();
