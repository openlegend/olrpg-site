import angular from 'angular';
import 'angular-mocks';
import chai from 'chai';
import banes from 'app/banes/banes';

const assert = chai.assert;

describe('banes', function() {
  it('exists', function() {
    assert.isDefined(banes);
  });

  // @TODO - work this out with tristan

  // beforeEach(inject((_$rootScope_, _$controller) => {
  //   $rootScope = _$rootScope_;
  //   $controller = _$controller_;
  // }));


  // beforeEach(inject(($rootScope, $controller) => {
  //   scope = $rootScope.$new();
  //   ctrl = $controller('BanesCtrl', {$scope: scope});
  // }));

  // describe('the banes route', () => {
  //   it('has a controller called BanesCtrl', () => {
  //     console.log(ctrl);
  //     expect(ctrl).not.to.be.empty;
  //   });
  // });

  // uncomment for a sanity check
  //it('can fail', function() {
    //assert.fail();
  //});
});
