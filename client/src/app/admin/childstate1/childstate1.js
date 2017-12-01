import angular from 'angular';
import './childstate1.tpl';


const childstate1Module = angular.module('admin.childstate1', [
  'app/admin/childstate1/childstate1.tpl.html'
]);

childstate1Module.controller('Childstate1Ctrl', function($scope){
  $scope = $scope;
  console.log('childstate1!');
});

export default childstate1Module;
