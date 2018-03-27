/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat.config', [])
    .factory('backendUtilService', backendUtilService);

  function backendUtilService() {

    let api = {
      "BackendUrl": "http://ec2-54-84-172-12.compute-1.amazonaws.com:8000/",
      "BackendType": "dev"
    };

    let endPoints = {
      "userLogin": "users/login",
      "userSignUp": "users"
    };

    return {
      getApiUrl: getApiUrl,
      getEndPoint: getEndPoint,
      createApiRequest: createApiRequest
    };

    function getApiUrl() {
      return api;
    }

    function getEndPoint(endPoint) {
      return endPoints[endPoint];
    }

    function createApiRequest(credential, method, type) {

      let api = getApiUrl()['BackendUrl'];
      let endPoint = getEndPoint(type);

      console.log({
        method: method,
        url: `${api}${endPoint}`,
        header: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        data: credential
      });

      return {
        method: method,
        url: `${api}${endPoint}`,
        header: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        data: credential
      };

    }

  }
})();
