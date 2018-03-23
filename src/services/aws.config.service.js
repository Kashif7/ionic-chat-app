/**
 * Created by sasangachathumal on 3/23/18.
 * This service created for read aws json file and config aws bucket.
 * using $http module to get aws json file.
 * returning function is 'getAwsBucketConfig'
 */
(function () {
  angular
    .module('practeraChat')
    .factory('awsBucketConfigService', awsBucketConfigService);

  awsBucketConfigService.$inject = ['$http'];

  function awsBucketConfigService($http) {

    return {
      getAwsBucketConfig: getAwsBucketConfig
    };

    /**
     * This function will return a aws bucket if it config if it not config it return null
     */
    function getAwsBucketConfig() {
      getAwsUtilsJson().then((data) => {
        return configBucket(data.data);
      }).catch((error) => {
        console.error(error);
        return null;
      });

    }

    /**
     * This function get aws data from aws json file
     * @returns {json} - data of aws json file
     */
    function getAwsUtilsJson() {
      return $http.get("../awsUtils.json");
    }

    /**
     * This function config aws bucket
     * @param awsData - data what read from aws json file
     * @returns {AWS.S3} - aws bucker object
     */
    function configBucket(awsData) {

      var bucket;

      AWS.config.region = 'us-east-1'; // Region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:c49725aa-1708-48b3-bd2d-d3f605b829ee'
      });

      AWS.config.credentials.get(function (err) {
        if (err) {
          return null;
        }
      });

      bucket = new AWS.S3({
        params: {
          Bucket: awsData.bucket
        }
      });
      return bucket;
    };

  }
})();
