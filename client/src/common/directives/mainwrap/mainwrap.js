import angular from 'angular';
import 'angular-material';
import './mainwrap.tpl';
import './navList.tpl';
import './socialList.tpl';
import './footer.tpl';
import './mainwrap.css!';
import MainwrapCtrl from './mainwrap.controller';
import authService from 'common/services/auth.service';
import configService from 'config/config';
import fromNowFilter from 'common/filters/fromNow.filter';
import htmlFilter from 'common/filters/html.filter';

const mainwrapModule = angular.module('mainwrap.js', [
  'common/directives/mainwrap/mainwrap.tpl.html',
  'common/directives/mainwrap/navList.tpl.html',
  'common/directives/mainwrap/socialList.tpl.html',
  'common/directives/mainwrap/footer.tpl.html',
  authService.name,
  configService.name,
  fromNowFilter.name,
  htmlFilter.name
]);

mainwrapModule.directive('mainWrap', function () {
  return {
    templateUrl: 'common/directives/mainwrap/mainwrap.tpl.html',
    restrict: 'EA',
    transclude: true,
    controller: MainwrapCtrl,
    controllerAs: 'mainwrapCtrl',
    link: function (scope, element, attrs, controller) {
      attrs.$observe('toolbarTemplate',function(value){
          scope.toolbarTemplate = value;
      });
      attrs.$observe('subnavToggle', function (value) {
        controller.subnavToggle = value;
      })
    },
    bindToController: {
      subnavToggle: '@'
    }
  };
});

mainwrapModule.directive('extraToolbar', function ($http, $templateCache, $compile) {
  return {
    transclude: true,
    link: function(scope, element, attrs) {
      function loadTemplate(template) {
        $http.get(template, { cache: $templateCache })
          .success(function(templateContent) {
            element.replaceWith($compile(templateContent)(scope));
          });
      }

      scope.$watch(attrs.template, function (value) {
        if (value) {
          loadTemplate(value);
        }
      });

      if ( attrs.template ) {
        loadTemplate(attrs.template);
      }
    }
  }
});

mainwrapModule.directive('twitterTimeline', function() {
return {
     restrict: 'E',
     template: '<a class="twitter-timeline" href="https://twitter.com/openlegendrpg" data-widget-id="696092295943319552">Tweets by @openlegendrpg</a>',
     link: function(scope, element, attrs) {

      (function run(){
          (!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs"));
      })();

     }
   };
});

export default mainwrapModule;
