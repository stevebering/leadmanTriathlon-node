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
                    var combined;

                    if (scope.passwordVerify || controller.$viewValue) {
                        combined = scope.passwordVerify + '_' + controller.$viewValue;
                    }

                    return combined;
                }, function(value) {
                    if (value) {
                        controller.$parsers.unshift(function(viewValue) {
                            var origin = scope.passwordVerify;
                            if(origin !== viewValue) {
                                controller.$setValidity("passwordVerify", false);
                                return undefined;
                            }
                            else {
                                controller.$setValidity("passwordVerify", true);
                                return viewValue;
                            }
                        })
                    }
                })
            }
        }
    });
