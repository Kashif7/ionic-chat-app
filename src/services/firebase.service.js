(function () {
    angular
        .module('practeraChat')
        .factory('firebaseService', firebaseService);

    firebaseService.$inject = ['authService'];
    function firebaseService(_authService) {
        let messaging;
        let tokenSentToServer = false;

        return {
            configFirebase: configFirebase,
            configMessage: configMessage,
            requestPermission: requestPermission,
            getToken: getToken,
            onTokenRefresh: onTokenRefresh,
            onMessage: onMessage
        };

        function configFirebase() {
            let config = {
                apiKey: "AIzaSyB0GbLPy5PEqkteoLq6rNg-0LaibyheINo",
                authDomain: "practera-notification.firebaseapp.com",
                databaseURL: "https://practera-notification.firebaseio.com",
                projectId: "practera-notification",
                storageBucket: "practera-notification.appspot.com",
                messagingSenderId: "1036267604116"
            };
            firebase.initializeApp(config);
        }

        function configMessage() {
            messaging = firebase.messaging();
            messaging.usePublicVapidKey("BI3g0Hc4w9bNo2onAe2Ag6C8dqJP3SsXlxBPfMKEXoCqWrOJjUzHReT63ji5Wsz91OfisS_kO679UZAGvNonBbY");
        }

        function requestPermission() {
            messaging.requestPermission().then(function () {
                console.log('Notification permission granted.');
                getToken();
            }).catch(function (err) {
                console.log('Unable to get permission to notify.', err);
            });
        }

        function getToken() {
            messaging.getToken().then(function (currentToken) {
                if (currentToken) {
                    alert(currentToken);
                    console.log(currentToken, 'current eifjefi');
                    localStorage.setItem('firebase_token', currentToken);
                    _authService.setToken(currentToken);
                    tokenSentToServer = true;
                } else {
                    // Show permission request.
                    console.log('No Instance ID token available. Request permission to generate one.');
                    // Show permission UI.
                    //updateUIForPushPermissionRequired();
                    tokenSentToServer = false;
                }
            }).catch(function (err) {
                console.log('An error occurred while retrieving token. ', err);
                // showToken('Error retrieving Instance ID token. ', err);
                // setTokenSentToServer(false);
            });
        }

        function onTokenRefresh() {
            messaging.onTokenRefresh(function () {
                messaging.getToken().then(function (refreshedToken) {
                    localStorage.setItem('firebase_token', refreshedToken);
                    console.log('Token refreshed. ok');
                    // Indicate that the new Instance ID token has not yet been sent to the
                    // app server.
                    tokenSentToServer = false;
                    // Send Instance ID token to app server.
                    _authService.setToken(currentToken);
                    // _authService.updateToken(refreshedToken);
                    // ...
                }).catch(function (err) {
                    console.log('Unable to retrieve refreshed token ', err);
                    showToken('Unable to retrieve refreshed token ', err);
                });
            });
        }

        function onMessage() {
            messaging.onMessage(function (payload) {
                console.log('Message received. ', payload);
            });
        }
    }
})();
