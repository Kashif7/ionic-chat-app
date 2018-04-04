// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// import routing from './app.config';

(function () {

  angular.module('practeraChat', ['ionic', 'llNotifier', 'angularMoment', 'ngCookies', 'practeraChat.chat',
    'practeraChat.group', 'practeraChat.message', 'practeraChat.auth', 'practeraChat.config',
    'practeraChat.createChat', 'practeraChat.profile'])

    .run(function ($ionicPlatform, cordovaService, firebaseService) {
      firebaseService.configFirebase();
      $ionicPlatform.ready(function () {
        if (window.cordova) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          // cordova.plugins.Keyboard.disableScroll(true);
          console.log('cordova walata aawa');
          cordovaService.initialize();
        } else {
          firebaseService.configMessage();
          firebaseService.requestPermission();
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }

        console.log('cordova walata aawa 1');
      });
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

      console.log('cordova walata aawa 2');
      $httpProvider.defaults.headers.common = {};
      $httpProvider.defaults.headers.post = {};
      $httpProvider.defaults.headers.put = {};
      $httpProvider.defaults.headers.patch = {};

      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js
      $stateProvider

        // setup an abstract state for the tabs directive
        .state('nav', {
          cache: false,
          url: '/nav',
          abstract: true,
          templateUrl: 'templates/navigation.html',
          controller: 'appController',
          controllerAs: 'appCtrl'
        });
      let user = localStorage.getItem('user');

      console.log(user, 'dhggr');

      if (user) {
        $urlRouterProvider.otherwise('/nav/chat');
      } else {
        $urlRouterProvider.otherwise('/login');
      }

    });
})();
