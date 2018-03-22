
angular.module('practeraChat.messageCtrl', [])

  .controller('messageCtrl', function ($scope, $stateParams, Chats, $ionicHistory, $ionicPopup, $ionicPopover) {
    $scope.chat = Chats.get($stateParams.chatId);

    $scope.myGoBack = function () {
      $ionicHistory.goBack();
    };

    $scope.editGroupName = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<div class="list practera-forms"><label class="item item-input"><input type="text" value="Current name"></label></div>',
        title: 'Change Group Name',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: 'Save',
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

    var editGroupPhotoPopup;

    $scope.closeEditGroupPhoto = function () {
      editGroupPhotoPopup.close();
    };

    $scope.editGroupPhoto = function () {
      $scope.data = {};
      editGroupPhotoPopup = $ionicPopup.show({
        templateUrl: 'templates/group/image-edit-popup.html',
        title: 'Change Group Photo',
        scope: $scope,
        buttons: [
          {text: 'Cancel'}
        ]
      });
    };

    // $scope.showActionSheet = function () {
    //
    //   // Show the action sheet
    //   var hideSheet = $ionicActionSheet.show({
    //     buttons: [
    //       {text: '<i class="icon ion-share balanced"></i> Share'},
    //       {text: '<i class="icon ion-arrow-move assertive"></i> Move'}
    //     ],
    //     destructiveText: 'Delete',
    //     titleText: 'Modify your album',
    //     cancelText: 'Cancel',
    //     cancel: function () {
    //       // add cancel code..
    //     },
    //     buttonClicked: function (index) {
    //       return true;
    //     }
    //   });
    // };

    var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content> Hello! </ion-content></ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });

    $scope.openPopover = function ($event) {
      $scope.popover.show($event);

    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };

  });
