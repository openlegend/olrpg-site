'use strict';

import angular from 'angular';
import 'angular-ui-router';
import userService from 'common/services/user.service';
import configService from 'config/config';

const authServiceModule = angular.module('auth.service.js', [
  'ui.router',
  userService.name,
  configService.name
]);

authServiceModule.factory('Auth', function ($state, $timeout, $rootScope, $http, User, Config, $cookieStore, $q) {
    var currentUser = {};
    var isWaitingForInitialAuth =  true;
    var nextRoute =  false;

    if ($cookieStore.get('token')) {

        User.get( function (data) {
          // update currentUser, toggle waiting for Auth bool, route
          currentUser = data;
          isWaitingForInitialAuth =  false;
          // if the user API response was slow and the UI has pushed the user
          // to /login while waiting for a response, forward them to their
          // intended route
          if ( $state.current.name === 'login' ) {
            $state.go(nextRoute.name || 'content', {}, { reload: true });
          }
        }, function () {
          // error, so we remove the token and redirect to login
          isWaitingForInitialAuth =  false;
          $cookieStore.remove('token');
          currentUser = {};
          $state.go('login', {}, { reload: true });
        });

    } else {
      isWaitingForInitialAuth = false;
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login (user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post( Config.urlBase + '/api/auth/local', {
          username: user.username,
          password: user.password
        })
        .success((data) => {
          $cookieStore.put('token', data.token);
          User.get( (data) => {
            currentUser = data;
            deferred.resolve(data);
            return cb();
          }, (err) => {
            deferred.reject(err);
            return cb(err);
          });
        })
        .error((err) => {
          this.logout();
          deferred.reject(err);
          return cb(err);
        });

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout () {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser (user, callback) {
        var cb = callback || angular.noop;

        // @FIXME when organizations are ready
        user.organization = 'scala';

        return User.save(user,
          (data) => {
            if ( currentUser.hasOwnProperty('role') && currentUser.role === 'admin' ) {
              return cb(currentUser);
            }
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          (err) => {
            this.logout();
            return cb(err);
          }).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword (oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser () {
        return currentUser;
      },

      /**
       * Sets a property on the currentUser object
       *
       * @return {String} prop
       */
      setUserProperty (prop, val) {
        if ( currentUser.hasOwnProperty(prop) ) {
          currentUser[prop] = val;
        }
        return currentUser;
      },

      /**
       * Check if waiting for the initial Auth check
       *
       * @return {Boolean}
       */
      isWaitingForInitialAuth () {
        return isWaitingForInitialAuth;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn () {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync (cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Save the next route user is attempting to navigate to
       *
       * @return {Object}
       */
      setNextRoute (route) {
        if ( route.name !== 'login' && route.name !== 'logout' ) {
          nextRoute = route;
        }
        return nextRoute;
      },

      /**
       * Save the next route user is attempting to navigate to
       *
       * @return {Object}
       */
      getNextRoute () {
        return nextRoute;
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin () {
        return currentUser.role === 'admin';
      },

      /**
       * Get a list of user roles
       *
       * @return {Array}
       */
      getRoles () {
        return [
          {
            val: 'user',
            name: 'User'
          },
          {
            val: 'admin',
            name: 'Admin'
          }
        ];
      },

      /**
       * Get auth token
       */
      getToken () {
        return $cookieStore.get('token');
      }
    };
  });

export default authServiceModule;
