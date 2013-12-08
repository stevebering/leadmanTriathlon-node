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
    }]);