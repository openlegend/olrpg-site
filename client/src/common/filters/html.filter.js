// escapes html content
import angular from 'angular';

function filter ($sce){
  return function(input){
    return $sce.trustAsHtml(input);
  }
};

const htmlFilterModule = angular.module('html.filter.js', [])
  .filter('html', filter);

export default htmlFilterModule;

