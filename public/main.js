var gardenApp = angular.module('gardenApp', ['ngResource', 'ngRoute', 'xeditable', 'webcam']);

gardenApp.config(function($routeProvider, $compileProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/templates/home',
      controller: 'gardenListController'
    })
    .when('/view/:id', {
      templateUrl: '/templates/view',
      controller: 'viewController'
    });
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data):/);
});

gardenApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});


gardenApp.factory('gardenItems', function($resource){
  var model = $resource('/api/garden/:id', {id: '@_id'});
  
  return {
    model: model,
    items: model.query()
  };
});

gardenApp.controller('gardenListController', function($scope, gardenItems){
  $scope.items = gardenItems.items;



  $scope.addItem = function(){
    //gardenItems.items.push(this.newItem);
    var newPost = new gardenItems.model(this.newItem);
    newPost.$save(function(savedItem){
      gardenItems.items.push(savedItem);
    });
    this.newItem = {};
  };


});

gardenApp.controller('viewController', function($scope, gardenItems, $routeParams){
  var postId = $routeParams.id;
  $scope.garden = gardenItems.model.get({_id: postId});
});

gardenApp.directive('gardenitem', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/gardenItem',
    scope: {
      garden: '='
    },
    link: function(scope, element){
      console.log('this :   ', this);
      scope.snapShotEl = element[0].querySelector('.snapshot');
      console.log( 'shapshot el:  ', scope.snapShotEl);
    },
    controller: function($scope, gardenItems, $q, $http){
      console.log('controller scope', $scope);
      $scope.upvote = function(){
        this.garden.score++;
        this.garden.$save();
      };
      $scope.downvote = function(){
        this.garden.score--;
        this.garden.$save();
      };
      $scope.remove = function(garden){
        console.log(this.garden);
          this.garden.$remove();
          gardenItems.items.splice(gardenItems.items.indexOf(garden), 1);
      };
      $scope.addPlant = function(){
        this.garden.plants.push(this.newItem);
        this.garden.$save(function(){
          console.log(arguments);
          console.log('gardenscope', $scope.garden);
        });
        this.newItem = {};
      };
      $scope.removePlant = function(){
        console.log(this.plant);
        this.garden.plants.splice(this.garden.plants.indexOf(this.plant), 1);
        this.garden.$save();
      };
      $scope.toggle = function() {
        $scope.showPlantForm = !$scope.showPlantForm;
      };
      $scope.goAway = function() {
        $scope.gardenEdit = !$scope.gardenEdit;
      };
      $scope.getPlant = function() {
        $scope.showPlantList = !$scope.showPlantList;
      };
        $scope.checkTitle = function(data) {
          console.log($scope.garden._id);
          var id = $scope.garden._id;
          var d = $q.defer();
          $http.post('/checkTitle', {value: data, id: id}).success(function(res) {
            res = res || {};
            if(res.status === 'ok') { // {status: "ok"}
              d.resolve()
            } else { // {status: "error", msg: "Username should be `awesome`!"}
              d.resolve(res.msg)
            }
          }).error(function(e){
            d.reject('Server error!');
          });
          return d.promise;
        };
        $scope.checkLocation = function(data) {
          var id = $scope.garden._id;
          var d = $q.defer();
          $http.post('/checkLocation', {value: data, id: id}).success(function(res) {
            res = res || {};
            if(res.status === 'ok') { // {status: "ok"}
              d.resolve()
            } else { // {status: "error", msg: "Username should be `awesome`!"}
              d.resolve(res.msg)
            }
          }).error(function(e){
            d.reject('Server error!');
          });
          return d.promise;
        };
        $scope.checkSoil = function(data) {
          var id = $scope.garden._id;
          var d = $q.defer();
          $http.post('/checkSoil', {value: data, id: id}).success(function(res) {
            res = res || {};
            if(res.status === 'ok') { // {status: "ok"}
              d.resolve()
            } else { // {status: "error", msg: "Username should be `awesome`!"}
              d.resolve(res.msg)
            }
          }).error(function(e){
            d.reject('Server error!');
          });
          return d.promise;
        };
        $scope.checkWater = function(data) {
          var id = $scope.garden._id;
          var d = $q.defer();

          $http.post('/checkWater', {value: data, id: id}).success(function(res) {
            res = res || {};
            if(res.status === 'ok') { // {status: "ok"}
              d.resolve()
            } else { // {status: "error", msg: "Username should be `awesome`!"}
              d.resolve(res.msg)
            }
          }).error(function(e){
            d.reject('Server error!');
          });
          return d.promise;
        };
        $scope.checkSunlight = function(data) {
          var id = $scope.garden._id;
          var d = $q.defer();
          $http.post('/checkSunlight', {value: data, id: id}).success(function(res) {
            res = res || {};
            if(res.status === 'ok') { // {status: "ok"}
              d.resolve()
            } else { // {status: "error", msg: "Username should be `awesome`!"}
              d.resolve(res.msg)
            }
          }).error(function(e){
            d.reject('Server error!');
          });
          return d.promise;
        };
        $scope.checkComment = function(data) {
          var id = $scope.garden._id;
          var d = $q.defer();
          $http.post('/checkComment', {value: data, id: id}).success(function(res) {
            res = res || {};
            if(res.status === 'ok') { // {status: "ok"}
              d.resolve()
            } else { // {status: "error", msg: "Username should be `awesome`!"}
              d.resolve(res.msg)
            }
          }).error(function(e){
            d.reject('Server error!');
          });
          return d.promise;
        };///// WHERE ALL THE EDITINPLACE FUCNTIONS LIVE


      'use strict';

      var _video = null,
          patData = null;

      $scope.showDemos = false;
      $scope.edgeDetection = false;
      $scope.mono = false;
      $scope.invert = false;

      $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

      // Setup a channel to receive a video property
      // with a reference to the video element
      // See the HTML binding in main.html
      $scope.channel = {};

      $scope.webcamError = false;
      $scope.onError = function (err) {
          $scope.$apply(
              function() {
                  $scope.webcamError = err;
              }
          );
      };

      $scope.onSuccess = function () {
          // The video element contains the captured camera data
          _video = $scope.channel.video;
          console.log(_video);
          $scope.$apply(function() {
              $scope.patOpts.w = _video.width;
              $scope.patOpts.h = _video.height;
              $scope.showDemos = true;
          });
      };

      $scope.onStream = function (stream) {
          // You could do something manually with the stream.
      };


      /**
       * Make a snapshot of the camera data and show it in another canvas.
       */
      $scope.makeSnapshot = function makeSnapshot(_id) {
          if (_video) {
              var patCanvas = document.querySelector('.snapshot');
              patCanvas = $scope.snapShotEl;
              if (!patCanvas) return;

              patCanvas.width = _video.width;
              patCanvas.height = _video.height;
              var ctxPat = patCanvas.getContext('2d');

              var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
              ctxPat.putImageData(idata, 0, 0);

              sendSnapshotToServer(patCanvas.toDataURL(), _id);

              patData = idata;
          }
      };

      /**
       * Redirect the browser to the URL given.
       * Used to download the image by passing a dataURL string
       */
      $scope.downloadSnapshot = function downloadSnapshot(dataURL) {
        console.log(dataURL);
          window.location.href = dataURL;
      };

      var getVideoData = function getVideoData(x, y, w, h) {
          var hiddenCanvas = document.createElement('canvas');
          hiddenCanvas.width = _video.width;
          hiddenCanvas.height = _video.height;
          var ctx = hiddenCanvas.getContext('2d');
          ctx.drawImage(_video, 0, 0, _video.width, _video.height);
          return ctx.getImageData(x, y, w, h);
      };

      /**
       * This function could be used to send the image data
       * to a backend server that expects base64 encoded images.
       *
       * In this example, we simply store it in the scope for display.
       */
      var sendSnapshotToServer = function sendSnapshotToServer(imgBase64, _id) {
        $scope.snapshotData = imgBase64;
          console.log(imgBase64);
           console.log('id', _id);
          $http.put('/api/garden/'+ _id, {img: imgBase64})
            .success(function(res) {
              console.log(res);
          })
            .error(function(res) {
              console.log(res);
          });
      };


      (function() {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;
      })();

      var start = Date.now();

      /**
       * Apply a simple edge detection filter.
       */
      function applyEffects(timestamp) {
        var progress = timestamp - start;

        if (_video && $scope.edgeDetection) {
          var videoData = getVideoData(0, 0, _video.width, _video.height);

          var resCanvas = document.querySelector('#result');
          if (!resCanvas) return;

          resCanvas.width = _video.width;
          resCanvas.height = _video.height;
          var ctxRes = resCanvas.getContext('2d');
          ctxRes.putImageData(videoData, 0, 0);

          // apply edge detection to video image
          Pixastic.process(resCanvas, "edges", {mono:$scope.mono, invert:$scope.invert});
        }

        if (progress < 20000) {
          requestAnimationFrame(applyEffects);
        }
      }

      requestAnimationFrame(applyEffects);
    }
  };
});
