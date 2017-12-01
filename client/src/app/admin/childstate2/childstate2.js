import angular from 'angular';
import './childstate2.tpl';

const childstate2Module = angular.module('admin.childstate2', [
  'app/admin/childstate2/childstate2.tpl.html'
]);

childstate2Module.controller('Childstate2Ctrl', function($scope){
  $scope = $scope;
  console.log('childstate2!');
});

export default childstate2Module;
