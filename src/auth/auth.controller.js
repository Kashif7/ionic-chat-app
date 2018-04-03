/**
 * Created by sasangachathumal on 3/23/18.
 * $state.go('app.home');
 */
(function () {
  angular
    .module('practeraChat.auth')
    .controller('authController', authController);

  authController.$inject = ['authDataService', '$state', '$ionicHistory', '$ionicPopup'];

  function authController(_authDataService, $state, $ionicHistory, $ionicPopup) {
    let vm = this;

    vm.signInCredential = {};
    vm.signUpCredential = {};
    vm.signUpCredential.user_type = "User";
    vm.signInError = false;
    vm.signInMessage = "";
    vm.signUpError = false;
    vm.signUpMessage = "";

    vm.userSignIn = userSignIn;
    vm.userSignUp = userSignUp;
    vm.selectUserType = selectUserType;
    vm.removeErrorMessages = removeErrorMessages;
    vm.goToBackView = goToBackView;

    function signInSuccessCallback(response) {
      vm.signInError = false;
      $state.go('nav.chat');
    }

    function goToBackView() {
      $ionicHistory.goBack();
    }

    function signInErrorCallback(error) {
      vm.signInError = true;
      vm.signInMessage = error;
    }

    function userSignIn() {
      _authDataService.signIn(vm.signInCredential, signInSuccessCallback, signInErrorCallback);
    }

    function signInAfterSignUpSuccessCallback(response) {
      vm.signUpError = false;
      $state.go('nav.chat');
    }

    function signUpSuccessCallback(response) {
      vm.signUpError = false;
      let credential = {
        email: vm.signUpCredential.email,
        password: vm.signUpCredential.password
      };
      _authDataService.signIn(credential, signInAfterSignUpSuccessCallback, signUpErrorCallback );
    }

    function signUpErrorCallback(error) {
      vm.signUpError = true;
      vm.signUpMessage = error;
    }

    function userSignUp() {

      console.log(vm.signUpCredential.first_name, vm.signUpCredential.last_name , vm.signUpCredential.email , vm.signUpCredential.password);

      if (vm.signUpCredential.first_name && vm.signUpCredential.last_name && vm.signUpCredential.email && vm.signUpCredential.password) {
        let message = '';
        if (vm.signUpCredential.user_type === 'Admin') {
          message = 'Are you sure you want to register as <b>Help Desk</b> user.';
        } else {
          message = 'Are you sure you want to register as <b>Chat App</b> user.';
        }

        var confirmPopup = $ionicPopup.confirm({
          title: 'Registration',
          template: message
        });
        confirmPopup.then(function (res) {
          if (res) {
            _authDataService.signUp(vm.signUpCredential, signUpSuccessCallback, signUpErrorCallback);
          } else {
          }
        });
      } else {
        var alertPopup = $ionicPopup.alert({
          title: 'Check Entered data',
          template: 'Please fill all required fields!'
        });
      }
    }

    function selectUserType(type) {
      vm.signUpCredential.user_type = type;
    }

    function removeErrorMessages() {
      vm.signUpError = false;
      vm.signUpMessage = "";
      vm.signInError = false;
      vm.signInMessage = "";
    }

  }
})();
