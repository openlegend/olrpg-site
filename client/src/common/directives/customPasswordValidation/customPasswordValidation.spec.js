import angular from 'angular';
import 'angular-mocks';
import customPasswordValidation from './customPasswordValidation';
import chai from 'chai';
import chaiJq from 'chai-jq';

chai.use(chaiJq);
const expect = chai.expect;

describe('directive: customPasswordValidation', () => {
  let element;
  let compiled;
  let scope;

  beforeEach(angular.mock.module(customPasswordValidation.name));

  beforeEach(inject(($rootScope, $compile) => {
    scope = $rootScope.$new();

    const elementTemplate = '<input type="password" custom-password-validation required name="testSignup" ng-model="password">';
    element = angular.element(elementTemplate);

    compiled = $compile(element)(scope);
    scope.$digest();
  }));

  const checkValid = (password) => {
    it(`is valid for ${ password }`, () => {
      scope.password = password;
      scope.$digest();
      expect(element).to.have.$class('ng-valid');
    });
  };

  const checkInvalid = (password) => {
    it(`is invalid for ${ password }`, () => {
      scope.password = password;
      scope.$digest();
      expect(element).to.have.$class('ng-invalid');
    });
  };

  checkValid('FooBarBaz1');

  checkInvalid('FooBar1');
  checkInvalid('FooBarBaz');
  checkInvalid('foobarbaz1');
  checkInvalid('FOOBARBAZ1');

});
