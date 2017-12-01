'use strict';

import angular from 'angular';

const configServiceModule = angular.module('config.js', []);

configServiceModule.factory('Config', function () {
    return {
      timestamp: DATE_TO_REPLACE,
      urlBase: `${ window.location.protocol }//${ window.location.host }/`
    };
  });

export default configServiceModule;
