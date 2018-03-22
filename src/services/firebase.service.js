(function () {
    angular
        .module('practeraChat')
        .factory('firebaseService', firebaseService);

    function firebaseService() {
        return {
            getThreads: getThreads
        };

        function getThreads(userId, callback) {
            let ref  = firebase.database().ref(`/threads/${userId}`);
            ref.on('value', callback);
        }
    }
})();