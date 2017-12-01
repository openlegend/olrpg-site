'use strict';

import angular from 'angular';
import 'angular-material';
import mainwrap from 'common/directives/mainwrap/mainwrap';
import configService from 'config/config';
import LicenseCtrl from './license.controller';
import './license.tpl';
import './license.css!';

const licenseModule = angular.module('license', [
  mainwrap.name,
  configService.name,
  'app/license/license.tpl.html',
]);

licenseModule.config( ($stateProvider) => {
  $stateProvider
    .state('license', {
      url: '/community-license',
      templateUrl: 'app/license/license.tpl.html',
      controller: LicenseCtrl,
      controllerAs: 'licenseCtrl'
    });
});

export default licenseModule;
