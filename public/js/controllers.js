/**
 * Created by stevebering on 12/7/13.
 */
'use strict';

/* controllers */

function UsersController($scope, $http) {
    $http.get('/api/users')
        .success(function(data, status, headers, config) {
            $scope.users = data.users;
        });
}

function SessionsController($scope, $http) {
    $http.get('/api/session')
        .success(function(data, status, headers, config) {
            $scope.sessions = data.sessions;
        });
}

function AddSessionController($scope, $http, $location) {
    $scope.form = {};
    $scope.submitSession = function() {
        $http.post('/api/sessions', $scope.form)
            .success(function(data) {
                $location.path('/');
            });
    };
}

function AddUserController($scope, $http, $location) {
    $scope.form = {};
    $scope.submitUser = function() {
        $http.post('/api/users', $scope.form)
            .success(function(data) {
                $location.path('/');
            });
    };
}
