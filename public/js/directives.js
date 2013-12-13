/**
 * Created by stevebering on 12/7/13.
 */
'use strict';

/* directives */

angular.module('leadman.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elem, attrs) {
            elem.text(version);
        }
    }])
    .directive('passwordVerify', function() {
        return {
            require: 'ngModel',
            scope: {
                passwordVerify: '='
            },
            link: function(scope, element, attrs, controller) {
                scope.$watch(function() {
                    console.log('value is changing...');
                    var combined;

                    if (scope.passwordVerify || controller.$viewValue) {
                        combined = scope.passwordVerify + '_' + controller.$viewValue;
                    }

                    console.log('combined: ' + combined);
                    return combined;
                }, function(value) {
                    console.log('value: ' + value);
                    if (value) {
                        console.log('we got a value...' + value);
                        controller.$parsers.unshift(function(viewValue) {
                            var origin = scope.passwordVerify;
                            console.log('origin: ' + origin);
                            if(origin !== viewValue) {
                                console.log(origin + ' does not match ' + viewValue + '. Setting invalid');
                                controller.$setValidity("passwordVerify", false);
                                return undefined;
                            }
                            else {
                                console.log(origin + ' does match ' + viewValue + '. Setting valid');
                                controller.$setValidity("passwordVerify", true);
                                return viewValue;
                            }
                        })
                    }
                })
            }
        }
    });
