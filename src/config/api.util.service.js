/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat.config', [])
    .factory('backendUtilService', backendUtilService);

  function backendUtilService() {

    let api = {
      "BackendUrl": "http://localhost:8000/",
      "BackendType": "dev"
    };

    let endPoints = {
      "userLogin": "users/login",
      "userSignUp": "users"
    };

    return {
      getApiUrl: getApiUrl,
      getEndPoint: getEndPoint
    };

    function getApiUrl() {
      return api;
    }

    function getEndPoint(endPoint) {
      return endPoints[endPoint];
    }
  }
})();
