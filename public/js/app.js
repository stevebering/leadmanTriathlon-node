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

leadman.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider, Auth) {

    // check if the user is logged in
    var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope, flash, Auth) {
      // initialize a new promise
        var deferred = $q.defer();

        // make an AJAX call to check if the user is logged in
        $http.get('/loggedIn').success(function(user) {
            // authenticated
            if (user !== '0') {
                console.log('user is authenticated with id: ' + user.id);
                console.log(user);
                if (!Auth.isLoggedIn()) {
                    Auth.signOn({
                        firstName: user.givenName,
                        lastName: user.givenName,
                        displayName: user.displayName
                    });
                }
                $timeout(deferred.resolve, 0);
            }
            // not authenticated
            else {
                notLoggedIn($timeout, deferred, $location, flash);
            }
        });

        return deferred.promise;
    };

    var notLoggedIn = function($timeout, deferred, $location, flash) {
        flash.info = "Please log in to view this page."
        console.log('user is not authenticated.');
        $timeout(function() {
            deferred.reject(); // reject the promise immediately
        }, 0);
        $location.url('/login');
    }

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
                       console.log('redirecting to login because we got a 401');
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

leadman.run(function($rootScope, $http, flash) {
    $rootScope.logout = function() {
        flash.info = "Logged out. Please close your browser to complete your logout."
        $http.post('/api/logout');
    };
})