import angular from 'angular';

const compileDirectiveModule = angular.module('compile.directive.js', []);

compileDirectiveModule.directive('compile', function ($compile) {

  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
      scope.$watch(function () {
        return scope.$eval(attrs.compile);
      }, (value) => {
        // Incase value is a TrustedValueHolderType, sometimes it
        // needs to be explicitly called into a string in order to
        // get the HTML string.
        element.html(value && value.toString());

        $compile(element.contents())(scope);
      });
    }
  };

});

export default compileDirectiveModule;
