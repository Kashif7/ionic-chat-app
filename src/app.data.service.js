/**
 * Created by sasangachathumal on 4/2/18.
 */
(function () {
  angular
    .module('practeraChat')
    .factory('appService', appService);

  appService.$inject = ['cookieManagerService', '$window', 'notifier', '$firebaseObject', 'messageDataService'];

  function appService(_cookieManagerService, $window, notifier, $firebaseObject, _messageDataService) {

    return {
      checkLoginUserTypeIsUser: checkLoginUserTypeIsUser,
      showNotification: showNotification
    };

    function checkLoginUserTypeIsUser() {
      let user = _cookieManagerService.getUserCookie();
      return user.user_type === 'User';
    }

    function showNotification(data) {
      var notification = {
        template: '<h3 ng-click="goToChat()">Click me!</h3>',
        scope: {
          goToChat: function () {
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
          }
        },
        hasDelay: false
      };
      notifier.notify(notification);
    }

  }
})();
