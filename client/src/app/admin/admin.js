import angular from 'angular';
import 'angular-material';
import './admin.tpl';
import mainwrap from 'common/directives/mainwrap/mainwrap';
import './childstate1/childstate1';
import './childstate2/childstate2';


const adminModule = angular.module('admin', [
  mainwrap.name,
  'admin.childstate1',
  'admin.childstate2',
  'app/admin/admin.tpl.html'
]);

adminModule.config(function($stateProvider){
  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'app/admin/admin.tpl.html',
    controller: 'AdminCtrl',
    controllerAs: 'adminCtrl',
  });

  $stateProvider.state('admin.childstate1', {
    url: '/childstate1',
    templateUrl: 'app/admin/childstate1/childstate1.tpl.html',
    controller: 'Childstate1Ctrl',
    controllerAs: 'childstate1Ctrl',
    parent: 'admin'
  });

  $stateProvider.state('admin.childstate2', {
    url: '/childstate2',
    templateUrl: 'app/admin/childstate2/childstate2.tpl.html',
    controller: 'Childstate2Ctrl',
    controllerAs: 'childstate2Ctrl',
    parent: 'admin'
  });
});

adminModule.controller('AdminCtrl', $scope =>  {
  $scope = $scope;
  console.log('admin!');
});

export default adminModule;
