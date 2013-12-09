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
    var user = $scope.user;
    console.log('Posting ' + JSON.stringify(user));
    $scope.addUser = function() {
        $http.post('/api/users', user)
            .success(function(data) {
                $location.path('/users');
            })
            .error(function() {
                console.log(err);
            });
    };
}
