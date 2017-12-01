'use strict';

import angular from 'angular';
import 'angular-ui-router';
import 'angular-messages';
import authService from 'common/services/auth.service';

const loginComponentControllerModule = angular.module('loginComponent.controller.js', [
  authService.name,
  'ui.router',
  'ngMessages'
]);

class LoginComponentCtrl {
  constructor ($state, $animate, Auth) {
    this.$state = $state;

    this.Auth = Auth;

    this.loginForm = {};
    this.user = {};
    this.user.email = '';
    this.user.password = '';
    this.errors = {};
  }
  // public methods

  login () {
    if(this.loginForm.$valid && !this.loginForm.$submitted) {

      this.loginForm.$submitted = true;

      this.Auth.login({
        username: this.user.email,
        password: this.user.password
      })
      .then( () => {
        // Logged in, redirect to home
        this.$state.go('content', null, { reload: true });
        if ( this.loginForm ) {
          this.loginForm.$submitted = false;
        }
      })
      .catch( (err) => {
        if ( err && err.code ) {
          this.errors[err.code] = err;
        }
        if ( this.loginForm ) {
          this.loginForm.$submitted = false;
        }
      });
    }
  }
}

loginComponentControllerModule.controller('LoginComponentCtrl', ['$state', '$animate', 'Auth', LoginComponentCtrl ]);

export default loginComponentControllerModule;
