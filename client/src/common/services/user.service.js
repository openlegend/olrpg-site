'use strict';

import angular from 'angular';
import 'angular-resource';
import configService from 'config/config';

export var userModule = angular.module('user.service.js', [
  'ngResource',
  configService.name
]);

userModule.service('User', function ($resource, Config) {
    return $resource( Config.urlBase + '/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      // changePassword: {
      //   method: 'PUT',
      //   params: {
      //     controller:'password'
      //   }
      // },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      save: {
        method: 'POST'
      }
    });
  });

export default userModule;
