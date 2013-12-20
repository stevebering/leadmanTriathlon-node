/**
 * Created by stevebering on 12/7/13.
 */
'use strict';

/* controllers */

function UsersController($scope, $http, $location) {
    $http.get('/api/users')
        .success(function(data, status, headers, config) {
            $scope.users = data.users;
        });

    $scope.addUser = function() {
        var user = $scope.user;
        console.log('Posting ' + JSON.stringify(user));
        $http.post('/api/users', user)
            .success(function(data) {
                $location.path('/users');
                console.log($location.path());
            });
    };

    $scope.registerUser = function() {
        var user = $scope.user;
        console.log('Posting ' + JSON.stringify(user));
        $http.post('/api/registerUser', user)
            .success(function(data) {
                $location.path('/users');
                console.log($location.path());
            });
    };

    $scope.login = function() {
        var username = $scope.username,
            password = $scope.password;
        console.log('signing in with username: ' + username + ' password: ' + password);


    }
}

function SessionsController($scope, $http, $location) {
    $scope.convertToUTC = function(dt) {
        if (!dt) {
            return dt;
        }
        var localDate = new Date(dt);
        var localTime = localDate.getTime();
        var localOffset = localDate.getTimezoneOffset() * 60000;
        return new Date(localTime + localOffset);
    };

    $scope.addSession = function() {
        var session = $scope.session;
        console.log('Posting ' + JSON.stringify(session));
        $http.post('/api/sessions', session)
            .success(function(data) {
                $location.path('/sessions');
                console.log($location.path());
            });
    };

    $http.get('/api/sessions')
        .success(function(data, status, headers, config) {
            $scope.sessions = data.sessions;
    });
}

function MenuController($scope, $http, $location) {
    $scope.getClass = function(path) {
        if ($location.path().substr(0, path.length) == path) {
            return true;
        }
        return false;
    };
}
