// /**
//  * Created by sasangachathumal on 3/19/18.
//  */
// angular.module('practeraChat.services', [])

//   .factory('Chats', function () {
//     // Might use a resource here that returns a JSON array

//     // Some fake testing data
//     var chats = [{
//       id: 0,
//       name: 'Ben Sparrow',
//       lastText: 'You on your way?',
//       image: 'https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_960_720.png'
//     }, {
//       id: 1,
//       name: 'Max Lynx',
//       lastText: 'Hey, it\'s me',
//       image: 'http://bdfjade.com/data/out/75/5807300-avatar-images.png'
//     }, {
//       id: 2,
//       name: 'Adam Bradleyson',
//       lastText: 'I should buy a boat',
//       image: 'http://bdfjade.com/data/out/75/5807300-avatar-images.png'
//     }, {
//       id: 3,
//       name: 'Perry Governor',
//       lastText: 'Look at my mukluks!',
//       image: 'https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_960_720.png'
//     }, {
//       id: 4,
//       name: 'Mike Harrington',
//       lastText: 'This is wicked good ice cream.',
//       image: 'https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_960_720.png'
//     }];

//     return {
//       all: function () {
//         return chats;
//       },
//       remove: function (chat) {
//         chats.splice(chats.indexOf(chat), 1);
//       },
//       get: function (chatId) {
//         for (var i = 0; i < chats.length; i++) {
//           if (chats[i].id === parseInt(chatId)) {
//             return chats[i];
//           }
//         }
//         return null;
//       }
//     };
//   });
