/**
 * Created by sasangachathumal on 3/23/18.
 * $state.go('app.home');
 */
(function () {
  angular
    .module('practeraChat.auth')
    .controller('authController', authController);

  authController.$inject = ['authDataService', '$state', 'cookieManagerService'];

  function authController(_authDataService, $state, cookieManagerService) {
    let vm = this;

    vm.signInCredential = {};
    vm.signUpCredential = {};
    vm.signUpCredential.user_type = "User";
    vm.signInStatus = "";
    vm.signInMessage = "";

    vm.userSignIn = userSignIn;
    vm.userSignUp = userSignUp;

    function signInSuccessCallback(response) {
      vm.signInStatus = "success";
      vm.signInMessage = response;
      cookieManagerService.setUserCookie(response.data.data);
      $state.go('nav.chat');
    }

    function signInErrorCallback(error) {
      vm.signInStatus = "error";
      vm.signInMessage = error;
    }

    function userSignIn() {
      _authDataService.signIn(vm.signInCredential, this);
    }

    function signUpSuccessCallback(response) {

    }

    function signUpErrorCallback(error) {

    }

    function userSignUp() {
      _authDataService.signUp(vm.signUpCredential, signUpSuccessCallback, signUpErrorCallback);
    }



  }
})();
