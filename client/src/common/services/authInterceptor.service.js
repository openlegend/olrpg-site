import angular from 'angular';

const authInterceptorModule = angular.module('authInterceptor.service.js', []);

authInterceptorModule.factory('authInterceptor', function ($rootScope, $q, $cookieStore) {
  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};
      if ($cookieStore.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError (response) {
      if(response.status === 401) {
        // remove any stale tokens
        $cookieStore.remove('token');
        return $q.reject(response);
      }
      else {
        return $q.reject(response);
      }
    }
  };
});

authInterceptorModule.config(($httpProvider) => {
  $httpProvider.interceptors.push('authInterceptor');
});

export default authInterceptorModule;
