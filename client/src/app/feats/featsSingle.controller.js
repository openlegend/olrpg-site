'use strict';

import angular from 'angular';
import 'lodash';
import feats from './feats.json!'
import featPrereqOutput from './featPrereqOutput';

class FeatsSingleCtrl {

  // called once when the class is instantiated
  constructor ($scope, $sce, $state, Config, Link, name) {
    this.$scope = $scope;
    this.Config = Config;
    this.Link = Link;
    this.featPrereqOutput = featPrereqOutput;

    this.feats = feats;
    const regex = new RegExp( `\\b${ name.toLowerCase().replace(/_/gi,' ')}`, 'gi');

    const currentFeatIndex = _.findIndex(feats, (feat) => {
      return ( feat.name.toLowerCase().match(regex) ) ? true : false;
    })
    this.feat = [feats[currentFeatIndex]];
  }

}

export default FeatsSingleCtrl;
