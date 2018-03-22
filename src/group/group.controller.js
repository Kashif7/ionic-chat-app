angular.module('practeraChat.groupListCtrl', [])

  .controller('groupListCtrl', function ($scope, Chats) {
    $scope.items = Chats.all();
  });