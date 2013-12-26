/**
 * Created by stevebering on 12/7/13.
 */
'use strict';

/* services */

var appServices = angular.module('leadman.services', [
    'angular-flash.service',
    'angular-flash.flash-alert-directive'
]);

appServices
    .value('version', '0.1');

appServices.config(function(flashProvider) {
    flashProvider.errorClassnames.push("alert-danger");
    flashProvider.successClassnames.push("alert-success");
    flashProvider.infoClassnames.push("alert-info");
    flashProvider.warnClassnames.push("alert-warning");
});

appServices.factory('Auth', function() {
   var isLoggedIn = false,
       defaultUser = {
        firstName: '',
        lastName: '',
        displayName: '',
        mapmyfitnessid: 0
       },
       currentUser = defaultUser;

   return {
       isLoggedIn: function() {
           return isLoggedIn;
       },
       currentUser: function() {
           return currentUser;
       },
       signOff: function() {
           console.log("signing user off");
           isLoggedIn = false;
           currentUser = defaultUser;
       },
       signOn: function(user) {
           console.log("signing user %s on (%s)", user.displayName, user.mapmyfitnessid);
           console.log(user);
           isLoggedIn = true;
           currentUser.firstName = user.firstName;
           currentUser.lastName = user.lastName;
           currentUser.displayName = user.displayName;
           currentUser.mapmyfitnessid = user.mapmyfitnessid;
       }
   };
});