/**
 * Created by sasangachathumal on 3/23/18.
 * $state.go('app.home');
 */
(function () {
  angular
    .module('practeraChat.auth')
    .controller('authController', authController);

  authController.$inject = ['authDataService'];

  function authController(_authDataService) {
    let vm = this;

    vm.credential = {};
    vm.signInStatus = "";
    vm.signInMessage = "";

    vm.userSignIn = userSignIn;
    vm.userSignUp = userSignUp;

    function signInSuccessCallback(response) {

    }

    function signInErrorCallback(error) {

    }

    function userSignIn() {
      _authDataService.signIn(vm.credential, this);
    }

    function signUpSuccessCallback(response) {

    }

    function signUpErrorCallback(error) {

    }

    function userSignUp() {
      _authDataService.signUp();
    }

  }
})();
