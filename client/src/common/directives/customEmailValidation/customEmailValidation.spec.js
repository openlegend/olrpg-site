import angular from 'angular';
import 'angular-mocks';
import customEmailValidation from './customEmailValidation';
import chai from 'chai';
import chaiJq from 'chai-jq';

chai.use(chaiJq);
const expect = chai.expect;

describe('directive: customEmailValidation', () => {
  let element;
  let compiled;
  let scope;

  beforeEach(angular.mock.module(customEmailValidation.name));

  beforeEach(inject(($rootScope, $compile) => {
    scope = $rootScope.$new();

    const elementTemplate = '<input type="email" custom-email-validation required name="testSignup" ng-model="email">';
    element = angular.element(elementTemplate);

    compiled = $compile(element)(scope);
    scope.$digest();
  }));

  const checkValid = (email) => {
    it(`is valid for ${ email }`, () => {
      scope.email = email;
      scope.$digest();
      expect(element).to.have.$class('ng-valid');
    });
  };

  const checkInvalid = (email) => {
    it(`is invalid for ${ email }`, () => {
      scope.email = email;
      scope.$digest();
      expect(element).to.have.$class('ng-invalid');
    });
  };

  checkValid('foo@gmail.com');
  checkValid('foo.bar.baz@yahoo.net');
  checkValid('foo&^(@gmail.com');
  checkValid('z@z.z');

  checkInvalid('');
  checkInvalid('foo');
  checkInvalid('foo@gmail');

});
