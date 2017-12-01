import angular from 'angular';
import 'angular-mocks';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import authServiceModule from './auth.service';

chai.use(sinonChai);
const expect = chai.expect;

describe('service: Auth', () => {
  let User;
  let Config;
  let $cookieStore;
  let $httpBackend;
  let Auth;
  let postData;
  let userInfo;
  let userObject;
  let anError;

  beforeEach('set up local test variables', () => {
    postData = {
      token: '123abc'
    };
    userInfo = {
      username: 'aUsername',
      password: 'aPassword'
    };
    userObject = {
      role: 'user'
    };
    anError = { code: 400, message: 'foo' };
  });

  beforeEach('inject mock modules', angular.mock.module(authServiceModule.name, ($provide) => {
    User = {
      get(callback) {
        callback = callback || angular.noop;
        callback(userObject);
      },
      save(data, successCallback) {
        successCallback({
          token: '123abc'
        });
        return { $promise: Promise.resolve() };
      }
    };
    $provide.value('User', User);

    Config = {
      urlBase: 'foo'
    };
    $provide.value('Config', Config);

    $cookieStore = {
      get: sinon.spy(),
      put: sinon.spy(),
      remove: sinon.spy()
    };

    $provide.value('$cookieStore', $cookieStore);
  }));

  beforeEach(inject((_$httpBackend_, _Auth_) => {
    $httpBackend = _$httpBackend_;
    Auth = _Auth_;
  }));

  const verifyBackend = () => {
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  };

  describe('login method', () => {
    it(`posts to urlBase at '/api/auth/login'`, () => {
      $httpBackend.expectPOST(Config.urlBase + '/api/auth/login')
        .respond(postData);
      Auth.login(userInfo);
      verifyBackend();
    });

    describe('on successful POST', () => {
      it('calls callback with no arguments', () => {
        const callback = sinon.stub();

        $httpBackend.whenPOST(Config.urlBase + '/api/auth/login')
          .respond(postData);

        Auth.login(userInfo, callback);
        $httpBackend.flush();
        expect(callback).to.have.been.called;
        expect(callback).to.have.been.calledWithExactly();
      });

      it('returns a promise that resolves to the user object', (done) => {
        $httpBackend.whenPOST(Config.urlBase + '/api/auth/login')
          .respond(postData);

        Auth.login(userInfo)
          .then((res) => {
            expect(res).to.equal(userObject);
            done();
          })
          .catch(done);

        $httpBackend.flush();
      });

      it('adds the token to the $cookieStore', (done) => {
        const token = '123abc';
        $httpBackend.whenPOST(Config.urlBase + '/api/auth/login')
          .respond({ token });

        Auth.login(userInfo)
          .then(() => {
            expect($cookieStore.put).to.have.been.calledWith('token', token);
            done();
          })
          .catch(done);

        $httpBackend.flush();
      });
    });

    describe('on failed POST', () => {
      it('calls Auth.logout()', () => {
        $httpBackend.whenPOST(Config.urlBase + '/api/auth/login')
          .respond(400, anError);

        Auth.logout = sinon.spy();
        Auth.login(userInfo);
        $httpBackend.flush();
        expect(Auth.logout).to.have.been.called;
      });

      it('calls callback with an error', () => {
        const callback = sinon.stub();

        $httpBackend.whenPOST(Config.urlBase + '/api/auth/login')
          .respond(400, anError);

        Auth.logout = angular.noop;
        Auth.login(userInfo, callback);
        $httpBackend.flush();
        expect(callback).to.have.been.calledWith(anError);
      });

      it('returns a promise that rejects with an error object', (done) => {
        $httpBackend.whenPOST(Config.urlBase + '/api/auth/login')
          .respond(400, anError);

        Auth.logout = angular.noop;
        Auth.login(userInfo)
          .then(null, (err) => {
            expect(err).to.deep.equal(anError);
            done();
          })
          .catch(done);
        $httpBackend.flush();
      });
    });
  });

  describe('logout method', () => {
    it('removes token from $cookieStore', () => {
      Auth.logout();
      expect($cookieStore.remove).to.have.been.calledWith('token');
    });
  });

  describe('createUser method', () => {
    it('calls User.save with the user data', () => {
      sinon.spy(User, 'save');
      Auth.createUser(userInfo);
      expect(User.save).to.have.been.called;
    });

    describe('on successful user creation', () => {
      it('calls the callback with the original user info', () => {
        const callback = sinon.spy();
        Auth.createUser(userInfo, callback);
        expect(callback).to.have.been.calledWith(userInfo);
      });

      it('adds the token to the $cookieStore', (done) => {
        Auth.createUser(userInfo, () => {
          expect($cookieStore.put).to.have.been.calledWith('token', '123abc');
          done();
        });
      });
    });

    describe('on failed user creation', () => {
      let userSaveErr;

      beforeEach('make User.save call the error callback and return a rejected promise', () => {
        userSaveErr = {};
        User.save = (user, successCallback, errorCallback) => {
          errorCallback(userSaveErr);
          return { $promise: Promise.reject(userSaveErr) };
        };
      });

      it('calls the callback with the error', () => {
        const callback = sinon.spy();

        Auth.createUser(userInfo, callback);
        expect(callback).to.have.been.calledWith(userSaveErr);
      });

      it('calls the logout method', () => {
        sinon.spy(Auth, 'logout');
        Auth.createUser(userInfo);
        expect(Auth.logout).to.have.been.called;
      });

    });
  });

  describe('for a logged in user', () => {
    beforeEach('log in a user', () => {
      $httpBackend.expectPOST(Config.urlBase + '/api/auth/login')
        .respond(postData);

      Auth.login(userInfo);
      $httpBackend.flush();
    });

    it('getCurrentUser() gets current user', () => {
      expect(Auth.getCurrentUser()).to.equal(userObject);
    });

    describe('setUserProperty method', () => {
      it('returns the current user', () => {
        expect(Auth.setUserProperty('foo', 'bar')).to.equal(userObject);
      });

      it(`can set a property on the current user if it's previously defined`, () => {
        const newRole = 'kingslayer';
        Auth.setUserProperty('role', newRole);
        expect(Auth.getCurrentUser()).to.have.property('role', newRole);
      });

      it(`can't set a property on the current user if it wasn't previously defined`, () => {
        Auth.setUserProperty('height', 10);
        expect(Auth.getCurrentUser()).not.to.have.property('height');
      });
    });

    it('isLoggedIn() is true', () => {
      expect(Auth.isLoggedIn()).to.be.true;
    });

    it('isAdmin() checks the currentUser.role', () => {
      userObject.role = 'admin';
      expect(Auth.isAdmin()).to.be.true;

      userObject.role = 'user';
      expect(Auth.isAdmin()).to.be.false;
    });
  });
});
