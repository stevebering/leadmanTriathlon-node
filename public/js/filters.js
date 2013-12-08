/**
 * Created by stevebering on 12/7/13.
 */
'use strict';

/* filters */

angular.module('leadman.filters', [])
    .filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]);