'use strict';

import angular from 'angular';

class CoreCtrl {

  // called once when the class is instantiated
  constructor ($scope, $mdMedia, $stateParams, Config, chapter) {
    this.$scope = $scope;
    this.$scope.chapter = chapter;
    this.$mdMedia = $mdMedia;
    this.Config = Config;

    this.$scope.sections = [
      '00-introduction',
      '01-character-creation',
      '02-actions-attributes',
      '03-feats',
      '04-perks-flaws',
      '05-wealth-equipment',
      '06-banes-boons',
      '07-combat',
      '08-running-the-game',
      '09-special-equipment'
    ]
  }

  getChapterIndex (chapter) {
    return this.$scope.sections.indexOf(chapter);
  }
}

export default CoreCtrl;

