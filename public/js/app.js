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

leadman.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/sessions', {
            templateUrl: 'partials/sessions',
            controller: SessionsController
        })
        .when('/users', {
            templateUrl: 'partials/users',
            controller: UsersController
        })
        .when('/addSession', {
            templateUrl: 'partials/addSession',
            controller: AddSessionController
        })
        .when('/addUser', {
            templateUrl: 'partials/addUser',
            controller: AddUserController
        })
        .when('/registerUser', {
            templateUrl: 'partials/registerUser',
            controller: RegisterUserController
        })
        .otherwise({
            redirectTo: '/'
        });

    //$locationProvider.html5Mode(true);
}]);