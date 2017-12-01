import angular from 'angular';
import 'angular-mocks';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import loginComponentController from './loginComponent.controller';

chai.use(sinonChai);
const expect = chai.expect;

describe('controller: LoginComponentCtrl', () => {
  let $rootScope;
  let controller;
  let $state;
  let $animate;
  let Auth;

  beforeEach(angular.mock.module(loginComponentController.name));

  beforeEach(inject(($controller, _$rootScope_) => {
    $rootScope = _$rootScope_;
    $state = {
      go: sinon.stub()
    };
    $animate = {};
    Auth = {
      login: sinon.stub().returns(Promise.resolve())
    };

    controller = $controller('LoginComponentCtrl', { $state, $animate, Auth });
  }));

  describe('login method', () => {
    beforeEach(() => {
      controller.loginForm.$valid = true;
      controller.loginForm.$submitted = false;
      controller.user = {
        email: 'anEmail',
        password: 'aPassword'
      };
    });

    it('does nothing if loginForm is not $valid', () => {
      controller.loginForm.$valid = false;
      controller.login();
      expect(Auth.login).not.to.have.been.called;
    });

    it('does nothing if loginForm has already been $submitted', () => {
      controller.loginForm.$submitted = true;
      controller.login();
      expect(Auth.login).not.to.have.been.called;
    });

    it('creates the user for a valid form', () => {
      controller.login();
      expect(Auth.login.args[0][0]).to.deep.equal({
        username: controller.user.email,
        password: controller.user.password
      });
    });

    it('goes to the content state after saving user', (done) => {
      const loginUserPromise = new Promise.resolve();
      Auth.login = sinon.stub().returns(loginUserPromise);

      controller.login();

      loginUserPromise.then(() => {
        expect($state.go).to.have.been.calledWith('content', null, { reload: true });
        done();
      })
      .catch(done);
    });

    it('catches errors when saving a user', (done) => {
      const err = {
        code: 401,
        message: 'Not Authorized'
      };
      const loginUserPromise = new Promise.reject(err);
      Auth.login = sinon.stub().returns(loginUserPromise);

      controller.login();

      loginUserPromise.catch(() => {
        expect(controller.errors[401]).to.deep.equal(err);
        done();
      })
      .catch(done);
    });

    it('allows the form to be submitted again after an error', (done) => {
      const err = {
        data: { code: 401, message: 'Not Authorized' }
      };
      const loginUserPromise = new Promise.reject(err);
      Auth.login = sinon.stub().returns(loginUserPromise);

      controller.login();

      loginUserPromise.catch(() => {
        expect(controller.loginForm.$submitted).to.be.false;
        done();
      })
      .catch(done);
    });
  });

});
