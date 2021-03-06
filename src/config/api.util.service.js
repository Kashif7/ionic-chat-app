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
      "userList": "users",
      "normalChatCreate": "users/create",
      "groupChatCreate": "users/group",
      "groupEdit": "users/group/edit",
      "groupUsers": "users/list",
      "myProfile": "users/self",
      "profileUpdate": "users/update",
      "logout": "users/logout",
      "removeMember": "users/group/remove",
      "addMember": "users/group/add",
      "addUserList": "users/list/other",
      "leaveGroup": "users/group/leave/self",
      "deleteConversation":"users/conversation/delete",
      "deleteMessage": "users/message/delete",
      "createHelpdeskChat": "users/helpdesk/create",
      "sendMessageToHelpdesk": "users/helpdesk/message"
    };

    return {
      getApiUrl: getApiUrl,
      getEndPoint: getEndPoint,
      createApiRequest: createApiRequest,
      createAuthenticateApiGetRequest: createAuthenticateApiGetRequest,
      createAuthenticatedApiRequestWithData : createAuthenticatedApiRequestWithRequestData,
      createAuthenticatedApiProfileUpdatedRequest : createAuthenticatedApiProfileUpdatedRequest
    };

    function getApiUrl() {
      return api;
    }

    function getEndPoint(endPoint) {
      return endPoints[endPoint];
    }

    function createApiRequest(data, method, type) {

      let api = getApiUrl()['BackendUrl'];
      let endPoint = getEndPoint(type);

      return {
        method: method,
        url: `${api}${endPoint}`,
        header: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        data: data
      };

    }

    function createAuthenticateApiGetRequest(type) {

      let api = getApiUrl()['BackendUrl'];
      let endPoint = getEndPoint(type);
      let token = cookieManagerService.getUserCookie()['auth_token'];

      return {
        method: 'GET',
        url: `${api}${endPoint}`,
        headers: {
          'X-AUTH-TOKEN': token
        }
      };

    }

    function createAuthenticatedApiRequestWithRequestData(data, method, type) {

      let api = getApiUrl()['BackendUrl'];
      let endPoint = getEndPoint(type);
      let token = cookieManagerService.getUserCookie()['auth_token'];

      return {
        method: method,
        url: `${api}${endPoint}`,
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-TOKEN': token
        },
        data: data
      };

    }

    function createAuthenticatedApiProfileUpdatedRequest(data, method, type) {

      let api = getApiUrl()['BackendUrl'];
      let endPoint = getEndPoint(type);
      let token = cookieManagerService.getUserCookie()['auth_token'];

      return {
        method: method,
        url: `${api}${endPoint}`,
        headers: {
          'Content-Type': 'application/json',
          'X-AUTH-TOKEN': token
        },
        data: data
      };

    }

  }
})();
