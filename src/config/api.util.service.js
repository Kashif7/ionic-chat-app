/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat.config', [])
    .factory('backendUtilService', backendUtilService);

  backendUtilService.$inject = ['cookieManagerService'];

  function backendUtilService(cookieManagerService) {

    let api = {
      "BackendUrl": "http://ec2-54-84-172-12.compute-1.amazonaws.com:8000/",
      "BackendType": "dev"
    };

    let endPoints = {
      "userLogin": "users/login",
      "userSignUp": "users",
      "userList": "users"
    };

    return {
      getApiUrl: getApiUrl,
      getEndPoint: getEndPoint,
      createApiRequest: createApiRequest,
      createAuthenticateApiGetRequest: createAuthenticateApiGetRequest
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

    function createAuthenticateApiGetRequest(type) {

      let api = getApiUrl()['BackendUrl'];
      let endPoint = getEndPoint(type);
      let token = cookieManagerService.getUserCookie()['auth_token'];
      console.log("util service", token);

      console.log({
        method: 'GET',
        url: `${api}${endPoint}`,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-AUTH-TOKEN': token
        }
      });

      return {
        method: 'GET',
        url: `${api}${endPoint}`,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-AUTH-TOKEN': token
        }
      };

    }

  }
})();
