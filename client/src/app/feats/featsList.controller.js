'use strict';

import angular from 'angular';
import 'lodash';
import feats from './feats.json!'
import featPrereqOutput from './featPrereqOutput';

class FeatsListCtrl {

  // called once when the class is instantiated
  constructor ($scope, $sce, $state, $mdMedia, Config, Link) {
    this.$scope = $scope;
    this.$scope.$mdMedia = $mdMedia;
    this.Config = Config;
    this.Link = Link;
    this.featPrereqOutput = featPrereqOutput;

    this.powers = [];
    this.powers = feats;
    this.attributes = [
            'All',
            'Alteration',
            'Creation',
            'Fortitude',
            'Energy',
            'Entropy',
            'Movement',
            'Influence',
            'Prescience',
            'Protection',
          ];
    this.selectedPowers = [];
    this.selectedAttributes = ['All'];
    this.searchQuery = '';
    this.attackAttrSearchText = '';
    this.powerLevelValue = 1;
    // this.powerComparator = 'or Greater';
    this.powerComparator = 'gte';
  }

  // public class methods
  updateSearchTextModel (val) {
    this.attackAttrSearchText = val;
  }

  attackAttrSearchFilter () {
    // return all the options if the user hasn't selected a filter
    return (item) => {
      return true;

      // @TODO - Make this work!
      if ( this.attackAttrSearchText === '' ){
        return true;
      } else {
        if ( !Array.isArray(item.prerequisite) ) return false;
        const prereqsAsString = item.prerequisite.join().toLowerCase();
        let matchedSelectWithPrereq = []
        this.selectedAttributes.forEach( attr => {
          if ( prereqsAsString.split(attr).length > 1 ) {
            matchedSelectWithPrereq.push(attr)
          }
        });
        return matchedSelectWithPrereq.length > 0;
      }
    }.bind(this);
  }

  textSearchFilter () {
    // if `searchQuery` is empty, we want to show all list items
    return (thisPower) => {
      // debugger;
      var item = thisPower;
      if ( this.searchQuery === '' && _.includes( this.selectedAttributes, 'All' ) ) {
        return true;
      }
      var regex = new RegExp(this.searchQuery, 'gi');
      var show = false; // initially we assume that we won't show a given result
      var inAttackFilter = true;
      // now we look for matches in the following object properties
      show = item.name.match(regex) || item.description.match(regex) || item.effect.match(regex);
      // if the selectedAttributes array is longer than 0, we need to show
      // only results that match one of the selected properties
      if ( this.selectedAttributes.length > 0 ) {
        var inAttackFilter = false;
        if ( this.selectedAttributes.indexOf('All') !== -1 ) {
          inAttackFilter = true;
        } else {
          var searchAttrs = angular.copy( this.selectedAttributes );
          var inAttackFilter = _.intersection( item.attribute, searchAttrs ).length > 0;
        }
      }
      // return the result (either `true` or `false`)
      return show && inAttackFilter;
    }
  }

  powerLevelFilter () {
    return (thisPower) => {
      var item = thisPower;
      // const powerAbove = ( this.powerComparator === 'or Greater' );
      // const powerAbove = ( this.powerComparator === 'or Greater' );
      // if ( this.powerComparator === 'greater' ) {

      // }
      var include = false;
      for (var i = 0; i <= item.cost.length; i++) {
        switch (this.powerComparator) {
          case 'gte':
            if ( item.cost[i] >= parseInt( this.powerLevelValue ) ) {
              include = true;
            }
            break;
          case 'eq':
            if ( item.cost[i] === parseInt( this.powerLevelValue ) ) {
              include = true;
            }
            break;
          case 'lte':
            if ( item.cost[i] <= parseInt( this.powerLevelValue ) ) {
              include = true;
            }
            break;
        }

        // if ( powerAbove && item.cost[i] > this.powerLevelValue ) {
        //   include = true;
        //   break;
        // } else if ( !powerAbove && item.cost[i] <= this.powerLevelValue ) {
        //   include = true;
        //   break;
        // }
      };
      return include;

    }
  }

  getCost (costs) {
    let output = '';
    if (costs.length > 1) {
      costs.splice(costs.length - 1, 1, ' or ' + costs.length)
      costs.forEach( (cost, i) => {
        output += `${ cost }${ (i !== costs.length - 1) ? ', ' : ' points' }`;
      });
      return output;
    } else {
      return `${ costs[0] } ${ (costs[0] > 1) ? 'points' : 'point' }`;
    }
  }
}

export default FeatsListCtrl;
