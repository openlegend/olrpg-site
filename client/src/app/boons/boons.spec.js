import angular from 'angular';
import 'angular-mocks';
import chai from 'chai';
import boons from 'app/boons/boons';

const assert = chai.assert;

describe('boons', function() {
  it('exists', function() {
    assert.isDefined(boons);
  });

  // @TODO - work this out with tristan

  // beforeEach(inject((_$rootScope_, _$controller) => {
  //   $rootScope = _$rootScope_;
  //   $controller = _$controller_;
  // }));


  // beforeEach(inject(($rootScope, $controller) => {
  //   scope = $rootScope.$new();
  //   ctrl = $controller('BoonsCtrl', {$scope: scope});
  // }));

  // describe('the boons route', () => {
  //   it('has a controller called BoonsCtrl', () => {
  //     console.log(ctrl);
  //     expect(ctrl).not.to.be.empty;
  //   });
  // });

  // uncomment for a sanity check
  //it('can fail', function() {
    //assert.fail();
  //});
});
