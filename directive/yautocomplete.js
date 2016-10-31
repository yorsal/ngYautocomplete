/*!
 * yautocomplete
 * 
 *
 * Copyright (c) 2016 leyang yorsal@gmail.com 80250726@qq.com
 * License: MIT
 *
 * 
 */
(function() {
'use strict';

var yautocomplete = angular.module('ngYautocomplete', []);

yautocomplete.directive('yautocomplete', ['$http', function($http) {

  return {
    restrict: 'E',
    scope: {
      
    },
    template: '<input type="text" class="form-control" ng-model="iputValue" name="" ng-keyup="keyupHandler($event)" />\
              <div class="demo"><a href="javascript:;" ng-mouseover="hoverHandler($index)" ng-class="{selected: $index == currentIndex}" ng-click="clickHandler(item)" ng-repeat="item in items">{{item.name}}</a></div>\
              '
    ,
  
    link: function($scope, element, attrs, yautocompleteCtrl) {
        $scope.currentIndex = -1;
        $scope.items = [];

        var timer,
           ngSource = attrs.ngSource || '',
           ngSourceUrl = attrs.ngSourceUrl || '',
           ngBounce = attrs.ngBounce || 0;


      function getSourceUrlByXhr(url, val, callback) {
          $http({
            url: url,
            method: 'get',
            params: {
              query: val
            }
          }).then(function(res){
            callback(res.data);
          });
            
      };
      
      function renderSource(inputValue)
      {

        var data = angular.fromJson(ngSource),
          renderData = [];
          
          if (angular.isArray(data))
          {
            angular.forEach(data, function(value, key) {

                var dataValue = value.name + '';

                if (dataValue.indexOf(inputValue) != -1) //find the word
                {
                    
                    renderData.push({ name: dataValue }); 
                  
                }
            });
            

          }
          
          if (renderData.length == 0)
          {
             $scope.items = [];
          }
          else
          {
             $scope.items = renderData;
          }
          //console.log($scope.items);
      };

      function renderSourceByXhr(inputValue)
      {
       
        getSourceUrlByXhr(ngSourceUrl, inputValue, function(data){

          
          if (data.length == 0)
          {
             $scope.items = [];
          }
          else
          {
             $scope.items = data;
          }

        });
      };

      function renderSearchResult()
      {
          //console.log($scope.items[$scope.currentIndex]);
          //
          if ($scope.items[$scope.currentIndex])
          {
            $scope.iputValue = $scope.items[$scope.currentIndex].name;
         
            $scope.items = [];
            $scope.$apply();
          }
          
      }

      $scope.hoverHandler = function(index) {
          $scope.currentIndex = index;
      };

      $scope.clickHandler = function(item){
          renderSearchResult();
          
      };

      $scope.keyupHandler = function($event)
      {
          if (!($event.which == 40 || $event.which == 38 || $event.which == 13))
          {
            
            if ($scope.iputValue)
            {
              if (ngSource)
              {
                renderSource($scope.iputValue);
              }
              else if (ngSourceUrl) //xhr
              {
                clearTimeout(timer);
                timer = setTimeout(function(){
                    renderSourceByXhr($scope.iputValue) 
                 }, ngBounce);
              }

            }
            else
            {
              //console.log(3);
              $scope.items = [];
            }
          }
      }

      element.on('keyup', function($event){


            $event.preventDefault;
            $event.stopPropagation();

          if ($event.which == 40) //down
          {
              if (($scope.currentIndex + 1) < $scope.items.length) {
                
                  $scope.currentIndex ++;
                  $scope.$apply();

              }
            
          }
          else if ($event.which == 38) //up
          {
            if ($scope.currentIndex >= 1) {
                $scope.currentIndex --;
                $scope.$apply();
                
            }

            
          }
          else if ($event.which == 13) //enter
          {
            renderSearchResult();
          }
          else if ($event.which == 27) //esc
          {

          }
          else
          {

            
          }

          

          
      });
     
    }
  };

}]);

}());