/**
 * Created by sasangachathumal on 4/2/18.
 */
(function () {
  angular
    .module('practeraChat.createChat')
    .factory('chatCreateService', chatCreateService);

  function chatCreateService() {

    let groupInfo = {};

    return {
      setGroupData: setGroupData,
      getGroupData: getGroupData
    };

    function setGroupData(group) {
      groupInfo = group;
    }

    function getGroupData() {
      return groupInfo;
    }

  }
})();
