import angular from 'angular';
import 'angular-mocks';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import signupController from './signup.controller';

chai.use(sinonChai);
const expect = chai.expect;

describe('controller: SignupCtrl', () => {
  let $rootScope;
  let controller;
  let $state;
  let $animate;
  let Auth;

  beforeEach(angular.mock.module(signupController.name));

  beforeEach(inject(($controller, _$rootScope_) => {
    $rootScope = _$rootScope_;
    $state = {
      go: sinon.stub()
    };
    $animate = {};
    Auth = {
      createUser: sinon.stub().returns(Promise.resolve())
    };

    controller = $controller('SignupCtrl', { $state, $animate, Auth });
  }));

  describe('signup method', () => {
    beforeEach(() => {
      controller.signupForm.$valid = true;
      controller.signupForm.$submitted = false;
      controller.user = {
        firstname: 'firstName',
        lastname: 'lastName',
        email: 'anEmail',
        password: 'aPassword'
      };
    });

    it('does nothing if signupForm is not $valid', () => {
      controller.signupForm.$valid = false;
      controller.signup();
      expect(Auth.createUser).not.to.have.been.called;
    });

    it('does nothing if signupForm has already been $submitted', () => {
      controller.signupForm.$submitted = true;
      controller.signup();
      expect(Auth.createUser).not.to.have.been.called;
    });

    it('creates the user for a valid form', () => {
      controller.signup();
      expect(Auth.createUser.args[0][0]).to.deep.equal({
        firstName:  controller.user.firstname,
        lastName:   controller.user.lastname,
        email:      controller.user.email,
        password:   controller.user.password
      });
    });

    it('goes to the content state after saving user', (done) => {
      const createUserPromise = new Promise.resolve();
      Auth.createUser = sinon.stub().returns(createUserPromise);

      controller.signup();

      createUserPromise.then(() => {
        expect($state.go).to.have.been.calledWith('content', null, { reload: true });
        done();
      })
      .catch(done);
    });

    it('catches errors when saving a user', (done) => {
      const err = {
        data: { code: 401, message: 'Not Authorized' }
      };
      const createUserPromise = new Promise.reject(err);
      Auth.createUser = sinon.stub().returns(createUserPromise);

      controller.signup();

      createUserPromise.catch(() => {
        expect(controller.errors[401]).to.deep.equal(err.data);
        done();
      })
      .catch(done);
    });

    it('allows the form to be submitted again after an error', (done) => {
      const err = {
        data: { code: 401, message: 'Not Authorized' }
      };
      const createUserPromise = new Promise.reject(err);
      Auth.createUser = sinon.stub().returns(createUserPromise);

      controller.signup();

      createUserPromise.catch(() => {
        expect(controller.signupForm.$submitted).to.be.false;
        done();
      })
      .catch(done);
    });
  });

});
