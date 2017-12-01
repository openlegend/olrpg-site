/* global self */

'use strict';

import 'angular-material';
import 'angular-ui-router';
import './loginModal.tpl';

const loginModalDirectiveModule = angular.module('loginModal.js', [
  'common/directives/loginModal/loginModal.tpl.html'
]);

class LoginModalCtrl {
  constructor ($scope, $mdDialog) {
    this.self = self;
    this.$scope =  $scope;
    this.$mdDialog =  $mdDialog;
  }
  hide () {
    this.$mdDialog.hide();
  }
  cancel () {
    this.$mdDialog.cancel();
  }
}

class LoginModalLaunchCtrl {
  constructor ( $rootScope, $state, $mdDialog, AUTH_EVENTS ) {
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$mdDialog = $mdDialog;

    this.showModal = function () {
      this.$mdDialog
        .show({
        controller: LoginModalCtrl,
        controllerAs: 'loginModalCtrl',
        templateUrl: 'common/directives/loginModal/loginModal.tpl.html',
        locals : {
          self: this // need to pass context to modal controller (out of `this` rootScope)
        },
        clickOutsideToClose: false
      });
    };

    this.hideModal = function () {
      $state.go($state.current, {}, {reload: true});
      this.$mdDialog.hide();
    };

    // show the modal when we hear a `sessionTimeout` event
    this.$rootScope.$on(AUTH_EVENTS.sessionTimeout, function (event) {
      // only show the login modal if not on the login page
      if ( $state.$current.name !== 'login' ) {
        event.currentScope.loginModalLaunchCtrl.showModal();
      }
    });

    // hide the modal when we hear a `loginSuccess` event
    this.$rootScope.$on(AUTH_EVENTS.loginSuccess, function (event) {
      event.currentScope.loginModalLaunchCtrl.hideModal();
    });
  }
}

loginModalDirectiveModule.directive('loginModal', function () {
    return {
      restrict: 'E',
      controller: LoginModalLaunchCtrl,
      controllerAs: 'loginModalLaunchCtrl'
    };
  });

export default loginModalDirectiveModule;
