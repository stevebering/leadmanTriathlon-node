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
}

function SessionsController($scope, $http, $location, $filter) {
    // set up defaults
    $scope.session = {
        startDate: $filter('date')(Date.now(), 'yyyy-MM-dd')
    };

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

function MenuController($scope, $http, $location, Auth) {
    $scope.getClass = function(path) {
        if ($location.path().substr(0, path.length) == path) {
            return true;
        }
        return false;
    };

    $scope.loggedIn = Auth.isLoggedIn;
    $scope.currentUser = Auth.currentUser;
}

function LoginController($scope, $rootScope, $http, $location, flash, Auth) {
    // this object will be filled by the form
    $scope.user = {};

    // register the login function
    $scope.login = function() {
        flash.clean();
        console.log("logging in as ");
        console.log($scope.user);
        $http.post('/login', {
            username: $scope.user.username,
            password: $scope.user.password
        })
        .success(function (user) {
            // no errors: authentication ok
            console.log("LoginController: logged in successfully as...");
            console.log(user);
            Auth.signOn({
                firstName: user.givenName,
                lastName: user.familyName,
                displayName: user.displayName,
                mapmyfitnessid: user.mapmyfitness_id
            });
            $scope.user.username = '';
            $scope.user.password = '';
            $location.url('/users');
            console.log($location.path());
        })
        .error(function() {
           // error: authentication failed
           console.log("failed to log in.");
            $scope.user.username = '';
            $scope.user.password = '';
           flash.error = "Unable to sign in with the provided credentials";
        });
    };

    $scope.logout = function() {
        flash.clean();
        console.log("logging out...");
        $http.post('/logout')
            .success(function() {
                console.log("logged out.");
                Auth.signOff();
                $location.url('/');
            })
            .error(function() {
                flash.error = "Unable to sign out. An error occurred.";
            });
    }
};