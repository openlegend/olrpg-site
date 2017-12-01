import angular from 'angular';
import 'angular-mocks';
import chai from 'chai';
import home from 'app/home/home';

const assert = chai.assert;

describe('home', function() {
  it('exists', function() {
    assert.isDefined(home);
  });

  // @TODO - work this out with tristan

  // beforeEach(inject((_$rootScope_, _$controller) => {
  //   $rootScope = _$rootScope_;
  //   $controller = _$controller_;
  // }));


  // beforeEach(inject(($rootScope, $controller) => {
  //   scope = $rootScope.$new();
  //   ctrl = $controller('HomeCtrl', {$scope: scope});
  // }));

  // describe('the home route', () => {
  //   it('has a controller called HomeCtrl', () => {
  //     console.log(ctrl);
  //     expect(ctrl).not.to.be.empty;
  //   });
  // });

  // uncomment for a sanity check
  //it('can fail', function() {
    //assert.fail();
  //});
});
