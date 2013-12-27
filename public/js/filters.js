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
    }])

    .filter('duration', function() {
        return function(input) {
            var length = moment.duration(input, 'seconds');
            return length.format(false, true);
        }
    })

    .filter('distance', function() {
        return function(input) {
            var meters = input;
            return (meters / 1600.00).toFixed(2) + ' miles';
        }
    })
    ;