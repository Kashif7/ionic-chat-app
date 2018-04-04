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
      console.log("showNotification", data);

      let user = JSON.parse(localStorage.getItem('user'));
      let threadId;
      if (data.tag) {
        threadId = data.tag;
      } else {
        threadId = data.data.tag;
      }
      let thread;

      let refString = `/threads/${user.id}/${threadId}`;
      let ref = firebase.database()
        .ref(refString);

      $firebaseObject(ref)
        .$loaded()
        .then((newThread) => {
          thread = newThread;
          var notification = {
            template: '<p ng-click="goToChat()">New message<br> from <small>{{title}}</small></p>',
            position: 'top right',
            scope: {
              title: thread.displayName,
              goToChat: function () {
                _messageDataService.setThread(thread);
                $window.location.href = (`#/chat-messages?type=${thread.type}`);
              }
            },
            hasDelay: true,
            delay: 3000,
          };
          notifier.notify(notification);
        });
    }

  }
})();
