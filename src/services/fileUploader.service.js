/**
 * Created by sasangachathumal on 3/23/18.
 */
(function () {
  angular
    .module('practeraChat')
    .factory('fileUploaderService', fileUploaderService);

  fileUploaderService.$inject = ['awsBucketConfigService'];

  function fileUploaderService(awsBucketConfigService) {
    let uploadJsonArray = [];
    let awsBucket;

    return {
      uploadFiles: uploadFiles,
      getUploadFileArray: getUploadFileJsonArray
    };

    /**
     * This function call aws bucket config service and upload files to aws bucket
     * @param files
     * @param progressCallback
     * @param sentCallback
     */
    function uploadFiles(files, progressCallback, sentCallback) {
      awsBucket = awsBucketConfigService.getAwsBucketConfig();
      let params = {};
      files.forEach((file) => {
        params = getUploadParams(file);
        awsBucket.upload(params).on('httpUploadProgress', progressCallback)
          .send(sentCallback);
      });
    }

    /**
     * This function create file json and push it to upload file array
     * @param docId
     * @param type
     * @param category
     * @returns {Array}
     */
    function getUploadFileJsonArray(docId, type, category) {
      let fileChooser = document.getElementById(docId);
      let file = fileChooser.files[0];
      let uploadJson = {};

      uploadJson.name = file.name.split('.')[0];
      uploadJson.extension = file.name.split('.').pop();
      uploadJson.type = type;
      uploadJson.contentType = file.type;
      uploadJson.category = category;
      uploadJson.file = file;

      uploadJsonArray.push(uploadJson);
      return uploadJsonArray;
    }

    /**
     * This function create and return the file path of uploading file
     * @param category - for what this file ex: group image, chat message, profile image
     * @param type - what is the file type ex: image, video, pdf
     * @param name - file name
     * @param extension - file extension ex: jpg, png
     * @returns {string}
     */
    function getPath(category, type, name, extension) {
      let categories = {
        "profile": "profile",
        "group": "group",
        "chat": "chat"
      };

      let types = {
        "image": "Images",
        "pdf": "pdf",
        "video": "video"
      };

      if (type == 'image') {
        name = new Date().getUTCMilliseconds();

      } else if (type === 'pdf-A' || type === 'pdf-C') {
        name = '_____' + name;
      }

      return `${categories[category]}${types[type]}/${name}.${extension}`;
    }

    /**
     * This function create a json with uploading file prams
     * @param file - uploading file data object
     * @returns {{Key: *, ContentType: *, Body: (*|angular.noop), ACL: string}}
     */
    function getUploadParams(file) {
      return {
        "Key": getPath(file.category, file.type, file.name, file.extension),
        "ContentType": file.contentType,
        "Body": file.file,
        "ACL": "public-read"
      };
    }

  }
})();
