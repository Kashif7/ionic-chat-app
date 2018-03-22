/**
 * Created by sasangachathumal on 3/20/18.
 */
angular.module('practeraChat.profileCtrl', [])

  .controller('profileCtrl', function ($scope, Chats, $ionicHistory, $ionicActionSheet, $ionicPopup) {
    $scope.items = Chats.all();

    $scope.myGoBack = function () {
      $ionicHistory.goBack();
    };

    $scope.forgetPassword = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/profile/change-password.html',
        title: 'Change Password',
        subTitle: 'Please fill all the required fields',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Submit',
            type: 'button-calm',
            onTap: function (e) {
              if (!$scope.data.wifi) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            }
          }
        ]
      });
    };


  });
