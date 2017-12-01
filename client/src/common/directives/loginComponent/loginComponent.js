'use strict';

import angular from 'angular';
import 'angular-material';
import 'angular-ui-router';
import authService from 'common/services/auth.service';
import loginComponentCtrl from './loginComponent.controller';
import customEmailValidation from 'common/directives/customEmailValidation/customEmailValidation';
import './loginComponent.tpl';
import './loginComponent.css!';

const loginDirectiveModule = angular.module('loginComponent.js', [
  'ngMaterial',
  'ui.router',
  authService.name,
  loginComponentCtrl.name,
  customEmailValidation.name,
  'common/directives/loginComponent/loginComponent.tpl.html',
]);

loginDirectiveModule.directive('loginComponent', function () {
    return {
      templateUrl: 'common/directives/loginComponent/loginComponent.tpl.html',
      restrict: 'E',
      // transclude: true,
      controller: 'LoginComponentCtrl',
      controllerAs: 'loginComponentCtrl'
    };
  });


export default loginDirectiveModule;
