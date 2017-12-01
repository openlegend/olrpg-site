'use strict';

import angular from 'angular';
import 'angular-material';
import mainwrap from 'common/directives/mainwrap/mainwrap';
import configService from 'config/config';
import CoreCtrl from './core.controller';
import './core.tpl';
import './core.css!';

import './00-introduction-toc.tpl';
import './01-character-creation-toc.tpl';
import './02-actions-attributes-toc.tpl';
import './03-banes-boons-toc.tpl';
import './04-feats-toc.tpl';
import './05-perks-flaws-toc.tpl';
import './06-wealth-equipment-toc.tpl';
import './07-combat-toc.tpl';
import './08-running-the-game-toc.tpl';
import './09-special-equipment-toc.tpl';


import './00-introduction.tpl';
import './01-character-creation.tpl';
import './02-actions-attributes.tpl';
import './03-banes-boons.tpl';
import './04-feats.tpl';
import './05-perks-flaws.tpl';
import './06-wealth-equipment.tpl';
import './07-combat.tpl';
import './08-running-the-game.tpl';
import './09-special-equipment.tpl';

const coreModule = angular.module('core', [
  mainwrap.name,
  configService.name,
  'app/core/core.tpl.html',
  'app/core/00-introduction-toc.tpl.html',
  'app/core/01-character-creation-toc.tpl.html',
  'app/core/02-actions-attributes-toc.tpl.html',
  'app/core/03-banes-boons-toc.tpl.html',
  'app/core/04-feats-toc.tpl.html',
  'app/core/05-perks-flaws-toc.tpl.html',
  'app/core/06-wealth-equipment-toc.tpl.html',
  'app/core/07-combat-toc.tpl.html',
  'app/core/08-running-the-game-toc.tpl.html',
  'app/core/09-special-equipment-toc.tpl.html',
  'app/core/00-introduction.tpl.html',
  'app/core/01-character-creation.tpl.html',
  'app/core/02-actions-attributes.tpl.html',
  'app/core/03-banes-boons.tpl.html',
  'app/core/04-feats.tpl.html',
  'app/core/05-perks-flaws.tpl.html',
  'app/core/06-wealth-equipment.tpl.html',
  'app/core/07-combat.tpl.html',
  'app/core/08-running-the-game.tpl.html',
  'app/core/09-special-equipment.tpl.html'
]);

coreModule.config( ($stateProvider) => {
  $stateProvider
    .state('core', {
      url: '/core-rules/:chapter',
      templateUrl: 'app/core/core.tpl.html',
      controller: CoreCtrl,
      controllerAs: 'coreCtrl',
      onEnter: ($state, chapter) => {
        if ( _.isEmpty(chapter) ) {
          $state.go('core', { chapter: '00-introduction' }, { reload: true });
        }
      },
      resolve: {
        chapter: ($stateParams) => {
          return $stateParams.chapter;
        }
      }
    })
    ;
});

export default coreModule;
