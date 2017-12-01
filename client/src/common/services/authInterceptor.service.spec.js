import angular from 'angular';
import 'angular-mocks';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import authInterceptorService from './authInterceptor.service';

chai.use(sinonChai);
const expect = chai.expect;

describe('service: authInterceptor', () => {
  let $rootScope;
  let $cookieStore;
  let authInterceptor;

  beforeEach('mock module', angular.mock.module(authInterceptorService.name, ($provide) => {
    $cookieStore = { get: sinon.stub(), remove: sinon.stub() };
    $provide.value('$cookieStore', $cookieStore);
  }));

  beforeEach(inject((_$rootScope_, _authInterceptor_) => {
    $rootScope = _$rootScope_;
    authInterceptor = _authInterceptor_;
  })); 

  describe('request method', () => {
    it('sets the Authorization header to the token from $cookieStore', () => {
      const aToken = '123abc';
      $cookieStore.get.withArgs('token').returns(aToken);

      const request = authInterceptor.request({});
      expect(request.headers.Authorization).to.equal(`Bearer ${ aToken }`);
    });

    it(`does nothing if there's no cookie in the store`, () => {
      $cookieStore.get.withArgs('token').returns();
      const request = authInterceptor.request({});
      expect(request.headers.Authorization).to.be.undefined;
    });
  });

  describe('responseError method', () => {
    it('removes the token from the $cookieStore if the error status was 401', (done) => {
      authInterceptor.responseError({ status: 401 })
        .catch((err) => {
          expect($cookieStore.remove).to.have.been.calledWith('token');
          expect(err.status).to.equal(401);
          done();
        })
        .catch(done);
      $rootScope.$digest();
    });
  });
});
