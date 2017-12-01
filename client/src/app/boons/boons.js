'use strict';

import angular from 'angular';
import 'angular-material';
import mainwrap from 'common/directives/mainwrap/mainwrap';
import BoonsListCtrl from './boonsList.controller';
import BoonsSingleCtrl from './boonsSingle.controller';
import './boonsList.tpl';
import './boonsSingle.tpl';
import './boons.header.tpl';
import './boons.css!';

import linkService from 'common/services/link.service';

const boonsModule = angular.module('boons', [
  mainwrap.name,
  'app/boons/boonsList.tpl.html',
  'app/boons/boonsSingle.tpl.html',
  'app/boons/boons.header.tpl.html',
  linkService
]);

boonsModule.filter('unsafe', function($sce) { return $sce.trustAsHtml; })

boonsModule.config( ($stateProvider) => {
  $stateProvider
    .state('boons', {
      url: '/boons',
      templateUrl: 'app/boons/boonsList.tpl.html',
      controller: BoonsListCtrl,
      controllerAs: 'boonsCtrl',
      authenticate: false,
    })
    .state('boonsSingle', {
      url: '/boons/:name',
      templateUrl: 'app/boons/boonsSingle.tpl.html',
      controller: BoonsSingleCtrl,
      controllerAs: 'boonsCtrl',
      authenticate: false,
      resolve: {
        name: ($stateParams) => {
          return $stateParams.name;
        }
      }
    })
    ;
});

export default boonsModule;
