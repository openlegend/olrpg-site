'use strict';

import angular from 'angular';
import 'lodash';
import banes from './banes.json!'

class BanesSingleCtrl {

  // called once when the class is instantiated
  constructor ($scope, $sce, $state, Config, Link, name) {
    this.$scope = $scope;
    this.Config = Config;
    this.Link = Link;

    this.banes = banes;
    const regex = new RegExp( `\\b${ name.toLowerCase().replace(/_/gi,' ')}`, 'gi');

    const currentItemIndex = _.findIndex(banes, (bane) => {
      return ( bane.name.toLowerCase().match(regex) ) ? true : false;
    });
    this.bane = [banes[currentItemIndex]];
  }

}

export default BanesSingleCtrl;
