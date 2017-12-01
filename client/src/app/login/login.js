import angular from 'angular';
import 'angular-material';
import userService from 'common/services/user.service';
import mainwrap from 'common/directives/mainwrap/mainwrap';
import loginComponent from 'common/directives/loginComponent/loginComponent';
import './login.tpl';
import './login.css!';

const loginModule = angular.module('login', [
  userService.name,
  mainwrap.name,
  loginComponent.name,
  'app/login/login.tpl.html'
]);

loginModule.config(function($stateProvider){
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'app/login/login.tpl.html',
    authenticate: false
  });

});

export default loginModule;
