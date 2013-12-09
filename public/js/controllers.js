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
                $location.path('#/sessions');
            });
    };
}

function AddUserController($scope, $http, $location) {
    $scope.addUser = function() {
        var user = $scope.user;
        console.log('Posting ' + JSON.stringify(user));
        $http.post('/api/users', user)
            .success(function(data) {
                $location.path('/users');
                console.log($location.path());
            })
            .error(function() {
                console.log('Unable to add user.');
            });
    };
}
