'use strict';

import angular from 'angular';
import 'lodash';
import boons from './boons.json!'

class BoonsListCtrl {

  // called once when the class is instantiated
  constructor ($scope, $location, $mdMedia, Config, Link) {

    this.$scope = $scope;
    this.$location = $location;
    this.$scope.$mdMedia = $mdMedia;
    this.Config = Config;
    this.Link = Link;
    this.items = boons || [];

    // actively generate a uniq array of all attributes used in the json resource
    this.filterAttributes = _.uniq( _.flatten(_.map(boons, 'attribute')) ).map( attr => { return { name: attr }});

    this.selectedAttributes = [];
    this.searchQuery = '';
    this.searchText = '';
    this.powerLevelValue = this.$location.$$search.All || 9;

    if ( !_.isEmpty( this.$location.$$search ) ) {
      this.selectedAttributes = [];
      Object.keys(this.$location.$$search).forEach( (val ) => {
        if ( _.find( this.filterAttributes, { name: val }) ) {
          this.selectedAttributes.push({ name: val, power: this.$location.$$search[val] });
        }
      });
    }

    this.$scope.$watch('boonsCtrl.powerLevelValue', (newVal, oldVal) => {
      if ( this.$location.$$search.All ) {
        this.$location.search( 'All', newVal )
      }
    }, true);

    // watch for changes to selectedItems filter, remove them from the querystring
    // if they are present
    this.$scope.$watch('boonsCtrl.selectedAttributes', (newVal, oldVal) => {

      // clear all params
      this.$location.$$search = {};

      // store all of the standard attributes other than 'All'
      const newAttrs =  newVal.filter( attr => attr.name !== 'All' );

      // when adding a new item, always set it's power level to the value from
      // the UI dropdown
      if ( newVal.length > oldVal.length ) {
        const addedAttr = _.difference( _.map(newAttrs, 'name'), _.map(oldVal, 'name') );
        const addedAttrIndex = _.findIndex( newAttrs, { name: addedAttr[0] });
        if ( addedAttrIndex > -1 ) {
          newAttrs.map( attr => {
            if ( addedAttr[0] === attr.name ) {
              attr.power = `${ this.powerLevelValue }`;
            }
          });
        }
      }

      // prevent duplicate instances of a given key
      newVal = _.uniqBy( newVal, 'name' );

      if ( _.isEmpty( newVal ) ) {
        newVal = [{ name: 'All' }];
      } else if ( newAttrs.length > 0 ) {
        newVal = newAttrs;
      }

      newVal.map( attr => {
        attr.power = attr.power || `${ this.powerLevelValue }`;
        return attr;
      });

      // set all incoming newVal params
      newVal.forEach( attr => {
        this.$location.search( attr.name, attr.power );
      });

      this.selectedAttributes = newVal;

    }, true);

  }

  // public class methods
  updateSearchTextModel (val) {
    this.searchText = val;
  }

  attackAttrSearchFilter () {
    // return all the options if the user hasn't selected a filter
    return Promise.resolve().then( () => {
      return this.filterAttributes.filter( attr => {
        const alreadyUsed = this.selectedAttributes.filter( selected => selected.name === attr.name );
        if ( alreadyUsed.length > 0 ) {
          return false;
        } else if ( this.searchText === '' ) {
          return true;
        } else {
          return attr.name.toLowerCase().match( this.searchText.toLowerCase() );
        }
      });
   });
  }

  textSearchFilter () {
    // if `searchQuery` is empty, we want to show all list items
    return (thisPower) => {
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
        if ( _.find( this.selectedAttributes, { name: 'All' } )  ) {
          inAttackFilter = true;
        } else {
          var searchAttrs = angular.copy( _.without( this.selectedAttributes, 'All' ) );
          var inAttackFilter = _.intersection( item.attribute, _.map(searchAttrs, 'name') ).length > 0;
        }
      }
      // return the result (either `true` or `false`)
      return show && inAttackFilter;
    }
  }

  powerLevelFilter () {
    return (thisPower) => {
      let item = thisPower;
      let include = false;
      if ( this.$location.$$search.All === '9' ) return true;

      // if there are any querystring search params
      if ( _.compact( _.map( this.selectedAttributes, 'power' ) ).length > 0 ) {
        for (var i = 0; i <= item.power.length; i++) {
          // find the intersection between attributes in this power and
          // attributes that are also in active parameters
          let intersectAttributes = _.intersection( item.attribute, _.map( this.selectedAttributes, 'name' ) );
          if ( this.$location.$$search.All >= item.power[0] ) {
            include = true;
            return include;
          } else if ( intersectAttributes.length > 0 ) {
            intersectAttributes.forEach( (attr) => {
              if ( this.$location.$$search[attr] >= item.power[0] || this.$location.$$search[attr] >= item.power[0] ) {
                include = true;
              }
            });
            return include;
          }
        };
      }

      return include;
    }
  }
}

export default BoonsListCtrl;
