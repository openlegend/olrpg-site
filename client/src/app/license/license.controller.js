'use strict';

import angular from 'angular';

class LicenseCtrl {

  // called once when the class is instantiated
  constructor ($scope, $mdMedia, Config) {
    this.$scope = $scope;
    this.$mdMedia = $mdMedia;
    this.Config = Config;
  }

  // public class methods
  deleteThisFunction () {
    // does nothing
  }
}

export default LicenseCtrl;

