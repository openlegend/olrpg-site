'use strict';

import angular from 'angular';
import 'angular-material';
import mainwrap from 'common/directives/mainwrap/mainwrap';
import BanesListCtrl from './banesList.controller';
import BanesSingleCtrl from './banesSingle.controller';
import './banesList.tpl';
import './banesSingle.tpl';
import './banes.header.tpl';
import './banes.css!';

import linkService from 'common/services/link.service';

const banesModule = angular.module('banes', [
  mainwrap,
  'app/banes/banesList.tpl.html',
  'app/banes/banesSingle.tpl.html',
  'app/banes/banes.header.tpl.html',
  linkService
]);

banesModule.filter('unsafe', function($sce) { return $sce.trustAsHtml; })

banesModule.config( ($stateProvider) => {
  $stateProvider
    .state('banes', {
      url: '/banes',
      templateUrl: 'app/banes/banesList.tpl.html',
      controller: BanesListCtrl,
      controllerAs: 'banesCtrl',
      authenticate: false,
    })
    .state('banesSingle', {
      url: '/banes/:name',
      templateUrl: 'app/banes/banesSingle.tpl.html',
      controller: BanesSingleCtrl,
      controllerAs: 'banesCtrl',
      authenticate: false,
      resolve: {
        name: ($stateParams) => {
          return $stateParams.name;
        }
      }
    })
    ;
});

export default banesModule;
