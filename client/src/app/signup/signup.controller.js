'use strict';

import angular from 'angular';
import 'angular-ui-router';
import 'angular-messages';
import authService from 'common/services/auth.service';
import customEmailValidation from 'common/directives/customEmailValidation/customEmailValidation';
import customPasswordValidation from 'common/directives/customPasswordValidation/customPasswordValidation';

const signupCtrlModule = angular.module('signup.controller.js', [
  'ui.router',
  'ngMessages',
  authService.name,
  customEmailValidation.name,
  customPasswordValidation.name
]);

class SignupCtrl {
  constructor ($state, $animate, Auth) {
    this.$state = $state;

    this.Auth = Auth;

    this.signupForm = {};
    this.user = {};
    this.user.email = '';
    this.user.password = '';
    this.errors = {};
  }
  // public methods

  signup () {
    if(this.signupForm.$valid && !this.signupForm.$submitted) {

      this.signupForm.$submitted = true;

      this.Auth.createUser({
        firstName: this.user.firstname,
        lastName: this.user.lastname,
        email: this.user.email,
        password: this.user.password,
      })
      .then( () => {
        // Logged in, redirect to home
        this.$state.go('content', null, { reload: true });
        this.signupForm.$submitted = false;
      })
      .catch( (err) => {
        this.errors[err.data.code] = err.data;
        this.signupForm.$submitted = false;
      });
    }
  }
}

signupCtrlModule.controller('SignupCtrl', ['$state', '$animate', 'Auth', SignupCtrl ]);

export default signupCtrlModule;
