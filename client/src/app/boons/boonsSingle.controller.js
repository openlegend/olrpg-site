'use strict';

import angular from 'angular';
import 'lodash';
import boons from './boons.json!'

class BoonsSingleCtrl {

  // called once when the class is instantiated
  constructor ($scope, $sce, $state, Config, Link, name) {
    this.$scope = $scope;
    this.Config = Config;
    this.Link = Link;

    this.boons = boons;
    const regex = new RegExp( `\\b${ name.toLowerCase().replace(/_/gi,' ')}`, 'gi');

    const currentItemIndex = _.findIndex(boons, (boon) => {
      return ( boon.name.toLowerCase().match(regex) ) ? true : false;
    })
    this.boon = [boons[currentItemIndex]];
  }

}

export default BoonsSingleCtrl;
