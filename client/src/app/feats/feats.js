'use strict';

import angular from 'angular';
import 'angular-material';
import mainwrap from 'common/directives/mainwrap/mainwrap';
import compileDirective from 'common/directives/compile.directive';
import FeatsListCtrl from './featsList.controller';
import FeatsSingleCtrl from './featsSingle.controller';
import './featsList.tpl';
import './featsSingle.tpl';
import './feats.header.tpl';
import './feats.css!';
import feats from './feats.json!'

import linkService from 'common/services/link.service';

const featsModule = angular.module('feats', [
  mainwrap,
  compileDirective,
  'app/feats/featsList.tpl.html',
  'app/feats/featsSingle.tpl.html',
  'app/feats/feats.header.tpl.html',
  linkService
]);

featsModule.filter('unsafe', function($sce) { return $sce.trustAsHtml; })

featsModule.config( ($stateProvider) => {
  $stateProvider
    .state('feats', {
      url: '/feats',
      templateUrl: 'app/feats/featsList.tpl.html',
      controller: FeatsListCtrl,
      controllerAs: 'featsCtrl',
      authenticate: false,
    })
    .state('featsSingle', {
      url: '/feats/:name',
      templateUrl: 'app/feats/featsSingle.tpl.html',
      controller: FeatsSingleCtrl,
      controllerAs: 'featsCtrl',
      authenticate: false,
      resolve: {
        name: ($stateParams) => {
          return $stateParams.name;
        }
      }
    })
    ;
});

export default featsModule;
