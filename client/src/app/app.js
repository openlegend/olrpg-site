'use strict';

import 'lodash';
import angular from 'angular';
import 'angular-animate';
import 'angular-material';
import 'angular-material/angular-material.min.css!';
import 'angular-ui-router';
import 'angular-cookies';
import 'oclazyload';
import {routing} from 'common/utils/routing';
import authBroadcastService from 'common/services/authBroadcast.service';
import authInterceptorService from 'common/services/authInterceptor.service';
import authService from 'common/services/auth.service';
import configService from 'config/config';
import loginModal from 'common/directives/loginModal/loginModal';
import loginComponent from 'common/directives/loginComponent/loginComponent';
import 'common/core.css!';

import homeModule from 'app/home/home';

const app = angular.module('olrpg', [
  'ui.router',
  'oc.lazyLoad',
  'ngMaterial',
  'ngCookies',
  'ngAnimate',
  authBroadcastService.name,
  authInterceptorService.name,
  authService.name,
  configService.name,
  loginModal.name,
  loginComponent.name,
  homeModule.name
]);

app.config(routing(app));

app.config(function ($urlRouterProvider, $locationProvider, $stateProvider, $httpProvider, $mdThemingProvider, $mdIconProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $httpProvider.useApplyAsync(true);

  $urlRouterProvider.otherwise('/');

  $mdThemingProvider.theme('default')
      .primaryPalette('deep-purple', {
        'default': '700',
        'hue-1': '300',
        'hue-2': '500',
        'hue-3': '50'
      })
      .accentPalette('light-green');

  $mdThemingProvider.theme('dark')
      .primaryPalette('deep-purple', {
        'default': '700',
        'hue-1': '300',
        'hue-2': '500',
        'hue-3': '50'
      })
      .dark();

  $mdIconProvider
       .defaultIconSet('assets/svg/sprite.stack.svg');       // Register a default set of SVG icons

  // the abstract state for login simply calls
  // Auth.logout() and redirects to the /login route
  $stateProvider.state('logout', {
    url: '/logout',
    controller: function($scope, $state, Auth) {
      Auth.logout();
      $scope.$evalAsync( function () {
        $state.go('login', {}, { reload: true });
      });
    },
    authenticate: false
  });
});

// enforce login / logout / and separate
// "guest" vs. authenticated-only routes
app.run(function ($rootScope, $state, $timeout, Auth) {
  // Redirect to login if route requires auth and you're not logged in
  $rootScope.$on('$stateChangeStart', function (event, next) {
    if ( next.name !== 'login' && next.name !== 'logout' && !next.abstract ) {
      Auth.setNextRoute( next );
    }
    if ( next.authenticate ) {
      Auth.isLoggedInAsync( (loggedIn) => {
        // prevent routing if the next route requires authentication
        // & we have no user
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $state.go('login', {}, { reload: true });
        } else if ( next.authenticate && loggedIn && next.name !== Auth.getNextRoute().name )  {
          $state.go( next.name, {}, { reload: false });
        }
      });
    }
  });
});

// bootstrap our application
angular.element(document).ready(function() {
  angular.bootstrap(document.body, [ app.name ], {
    // strictDi: true // turning off for now
  });
});

export default app;
