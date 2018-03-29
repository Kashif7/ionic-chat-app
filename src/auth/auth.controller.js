/**
 * Created by sasangachathumal on 3/23/18.
 * $state.go('app.home');
 */
(function () {
  angular
    .module('practeraChat.auth')
    .controller('authController', authController);

  authController.$inject = ['authDataService', '$state'];

  function authController(_authDataService, $state) {
    let vm = this;

    vm.signInCredential = {};
    vm.signUpCredential = {};
    vm.signUpCredential.user_type = "User";
    vm.signInStatus = "";
    vm.signInMessage = "";
    vm.signUpStatus = "";
    vm.signUpMessage = "";

    vm.userSignIn = userSignIn;
    vm.userSignUp = userSignUp;
    vm.selectUserType = selectUserType;

    function signInSuccessCallback(response) {
      $state.go('nav.chat');
    }

    function signInErrorCallback(error) {
      vm.signInStatus = "error";
      vm.signInMessage = error;
    }

    function userSignIn() {
      _authDataService.signIn(vm.signInCredential, signInSuccessCallback, signInErrorCallback);
    }

    function signInAfterSignUpSuccessCallback(response) {
      $state.go('nav.chat');
    }

    function signUpSuccessCallback(response) {
      let credential = {
        email: vm.signUpCredential.email,
        password: vm.signUpCredential.password
      };
      _authDataService.signIn(credential, signInAfterSignUpSuccessCallback, signUpErrorCallback );
    }

    function signUpErrorCallback(error) {
      vm.signUpStatus = "error";
      vm.signUpMessage = error;
    }

    function userSignUp() {
      _authDataService.signUp(vm.signUpCredential, signUpSuccessCallback, signUpErrorCallback);
    }

    function selectUserType(type) {
      vm.signUpCredential.user_type = type;
    }

  }
})();
