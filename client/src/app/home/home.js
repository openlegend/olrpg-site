'use strict';

import angular from 'angular';
import 'angular-material';
import mainwrap from 'common/directives/mainwrap/mainwrap';
import configService from 'config/config';
import HomeCtrl from './home.controller';
import './home.tpl';
import './home.css!';

const homeModule = angular.module('home', [
  mainwrap.name,
  configService.name,
  'app/home/home.tpl.html',
]);

homeModule.config( ($stateProvider) => {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/home/home.tpl.html',
      controller: HomeCtrl,
      controllerAs: 'homeCtrl'
    });
});

export default homeModule;
