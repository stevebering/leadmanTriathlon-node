/**
 * Created by stevebering on 12/7/13.
 */
'use strict';

var leadman = angular.module('leadman',
    [
        'leadman.filters',
        'leadman.services',
        'leadman.directives',
        'ngRoute'
    ]);

leadman.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // check if the user is logged in
    var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
      // initialize a new promise
        var deferred = $q.defer();

        // make an AJAX call to check if the user is logged in
        $http.get('/api/loggedin').success(function(user) {
            // authenticated
            if (user !== '0') {
                $timeout(deferred.resolve, 0);
            }
            // not authenticated
            else {
                $rootScope.message = "Please log in to view this page.";
                $timeout(function() { deferred.reject();}, 0);
                $location.url('/login');
            }
        });

        return deferred.promise;
    };

    // interceptor for AJAX errors in client
    $httpProvider.responseInterceptors.push(function($q, $location){
       return function(promise) {
           return promise.then(
               // success: just return the response
               function(response) {
                   return response;
               },
               // error: check the error status to get only the 401 statuses
               function(response) {
                   if (response.status === 401) {
                       $location.url('/login');
                   }
                   return $q.reject(response);
               }
           )
       }
    });

    $routeProvider
        .when('/sessions', {
            templateUrl: 'partials/sessions',
            controller: SessionsController,
            resolve: {
                loggedin: checkLoggedIn
            }
        })
        .when('/login', {
            templateUrl: 'anon/signin',
            controller: LoginController
        })
        .when('/users', {
            templateUrl: 'partials/users',
            controller: UsersController,
            resolve: {
                loggedin: checkLoggedIn
            }
        })
        .when('/addSession', {
            templateUrl: 'partials/addSession',
            controller: SessionsController,
            resolve: {
                loggedin: checkLoggedIn
            }
        })
        .when('/addUser', {
            templateUrl: 'partials/addUser',
            controller: UsersController,
            resolve: {
                loggedin: checkLoggedIn
            }
        })
        .when('/signup', {
            templateUrl: 'anon/signup',
            controller: UsersController
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

leadman.run(function($rootScope, $http) {
    $rootScope.message = '';

    $rootScope.logout = function() {
        $rootScope.message = 'Logged out';
        $http.post('/api/logout');
    }
})