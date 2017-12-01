import angular from 'angular';
import 'angular-material';
import userService from 'common/services/user.service';
import mainwrap from 'common/directives/mainwrap/mainwrap';
import signupController from './signup.controller';
import './signup.tpl';
import './signup.css!';

const signupModule = angular.module('signup', [
  userService.name,
  mainwrap.name,
  signupController.name,
  'app/signup/signup.tpl.html'
]);

signupModule.config(function($stateProvider){
  $stateProvider.state('signup', {
    url: '/signup',
    controller: 'SignupCtrl',
    controllerAs: 'signupCtrl',
    templateUrl: 'app/signup/signup.tpl.html',
    authenticate: false
  });
});

export default signupModule;
