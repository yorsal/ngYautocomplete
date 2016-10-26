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
    template: '<input type="text" class="form-control" ng-model="name" value="" name="" ng-keyup="keyupHandler()" />\
              <div class="demo"><a href="javascript:;" ng-click="clickHandler($event)" ng-repeat="item in items">{{item.name}}</a></div>\
              '
    ,
  
    link: function(scope, element, attrs, yautocompleteCtrl) {

        scope.items = [];

        var timer,
          inputObj = element.find('input'),
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
             scope.items = [];
          }
          else
          {
             scope.items = renderData;
          }
          //console.log(scope.items);
      }

      function renderSourceByXhr(inputValue)
      {
       
        getSourceUrlByXhr(ngSourceUrl, inputValue, function(data){

          
          if (data.length == 0)
          {
             scope.items = [];
          }
          else
          {
             scope.items = data;
          }

        });
      }
      
      scope.clickHandler = function($event){

          inputObj.val(angular.element($event.target).text());
          scope.items = [];
      };

      scope.keyupHandler = function(){

          

          var inputValue = inputObj.val();

          

              if (inputValue)
              {
                if (ngSource)
                {
                  renderSource(inputValue);
                }
                else if (ngSourceUrl) //xhr
                {
                  clearTimeout(timer);
                  timer = setTimeout(function(){
                      renderSourceByXhr(inputValue) 
                   }, ngBounce);
                }

              }
              else
              {
                //console.log(3);
                scope.items = [];
              }
         

          

          

          
      };
    }
  };

}]);

}());