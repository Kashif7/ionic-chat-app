/**
 * Created by sasangachathumal on 3/26/18.
 */
(function () {
  angular
    .module('practeraChat.createChat')
    .controller('chatCreateController', chatCreateController);

  chatCreateController.$inject = ['$state', 'authDataService'];

  function chatCreateController($state, _authDataService) {
    let vm = this;
    vm.contactList = [];

    activate();

    function userListOnSuccessCallback(response) {
      vm.contactList = response.data.data;
      console.log(vm.contactList);
    }

    function userListOnErrorCallback(error) {

    }

    function activate() {
      _authDataService.getUserList(userListOnSuccessCallback, userListOnErrorCallback);
    }

  }
})();
