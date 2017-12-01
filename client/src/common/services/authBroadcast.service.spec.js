import angular from 'angular';
import 'angular-mocks';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import authBroadcastModule from './authBroadcast.service';

chai.use(sinonChai);
const expect = chai.expect;

describe('service: authBroadcast', () => {
  let $rootScope;
  let authBroadcast;
  let AUTH_EVENTS;

  beforeEach('mock module', angular.mock.module(authBroadcastModule.name));

  beforeEach(inject((_$rootScope_, _authBroadcast_, _AUTH_EVENTS_) => {
    $rootScope = _$rootScope_;
    authBroadcast = _authBroadcast_;
    AUTH_EVENTS = _AUTH_EVENTS_;
  }));

  beforeEach('spy on the $broadcast method', () => {
    sinon.spy($rootScope, '$broadcast');
  });

  afterEach('release spy on $broadcast method', () => {
    $rootScope.$broadcast.restore();
  });

  it('foo bar!', () => {});

  describe('response method', () => {
    it('broadcasts the AUTH_EVENTS.loginSuccess event for status code 200', () => {
      const res = {
        data: { token: '123' },
        status: 200
      };
      authBroadcast.response(res);

      expect($rootScope.$broadcast).to.have.been.calledWith(AUTH_EVENTS.loginSuccess, res);
    });

    it('broadcasts nothing for status code other than 200', () => {
      const res = { 
        data: {},
        status: 201
      };
      authBroadcast.response(res);

      expect($rootScope.$broadcast).not.to.have.been.called;
    });
  });

  describe('responseError method', () => {
    it('broadcasts a server error if status code is 500 and no code is recognized', () => {
      const res = {
        data: {},
        status: 500
      };
      authBroadcast.responseError(res);

      expect($rootScope.$broadcast).to.have.been.calledWith(AUTH_EVENTS.serverError, res);
    });

    it(`broadcasts a loginFailed error if the code is 'authentication.failed'`, () => {
      const res = {
        data: { code: 'authentication.failed' },
        status: 500
      };
      authBroadcast.responseError(res);

      expect($rootScope.$broadcast).to.have.been.calledWith(AUTH_EVENTS.loginFailed, res);
    });

    it(`broadcasts a sessionTimeout error if the code is 'authentication.invalid'`, () => {
      const res = {
        data: { code: 'authentication.invalid' },
        status: 500
      };
      authBroadcast.responseError(res);

      expect($rootScope.$broadcast).to.have.been.calledWith(AUTH_EVENTS.sessionTimeout, res);
    });

    it('does nothing if there is no status on the res', () => {
      const res = {
        data: { code: 'authentication.invalid' }
      };
      authBroadcast.responseError(res);

      expect($rootScope.$broadcast).not.to.have.been.called;
    });
  });
});
