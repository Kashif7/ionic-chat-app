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
      let threadInfo = [];

      let user = JSON.parse(localStorage.getItem('user'));
      let threadId;
      let refString;
      let title;
      let name;

      if (user.user_type === 'User') {
        if (data.tag) {
          threadInfo = data.tag.split(" ");
          let threadId = threadInfo[0];
          if (data.type === 'HelpDesk') {
            refString = `/threads/helpDesk/${threadId}`;
            title = 'HelpDesk';
          } else {
            refString = `/threads/${user.id}/${threadId}`;
          }
          console.log(refString, 'refString');
        } else {
          threadInfo = data.tag.split(" ");
          let threadId = threadInfo[0];
          if (data.type === 'HelpDesk') {
            refString = `/threads/${user.id}/${threadId}`;
            title = 'HelpDesk';
          } else {
            refString = `/threads/${user.id}/${threadId}`;
          }
        }
      } else {
        if (data.tag) {
          threadInfo = data.tag.split(" ");
          let threadId = threadInfo[0];
          refString = `/threads/helpDesk/${threadId}`;
        } else {
          threadInfo = data.tag.split(" ");
          let threadId = threadInfo[0];
          refString = `/threads/helpDesk/${threadId}`;
        }
      }
      let thread;

      let ref = firebase.database()
        .ref(refString);

      $firebaseObject(ref)
        .$loaded()
        .then((newThread) => {
          thread = newThread;

          if (title) {
            name = title;
          } else {
            name = thread.displayName;
          }

          console.log(name, 'name');
          console.log(thread, 'thread');
          var notification = {
            template: '<p ng-click="goToChat()">New message<br> from <small>{{title}}</small></p>',
            position: 'top right',
            scope: {
              title: name,
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
