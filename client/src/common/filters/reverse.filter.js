import angular from 'angular';

function filter() {
  return (items) => items.reverse();
}

const reverseModule = angular.module('reverse.filter.js', [])
  .filter('reverse', filter);

export default reverseModule;
