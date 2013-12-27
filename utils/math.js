/**
 * Created by stevebering on 12/27/13.
 */
function summarize(rows, type) {
    return rows.filter(function(row) {
        return row.activityType === type;
    }).map(function(row) {
        console.log('row.distanceTotal: ' + row.distanceTotal);
        return row.distanceTotal / 1600.0; // get distance in miles
    }).reduce(function(previous, current) {
        console.log('previous: ' + previous);
        console.log('current: ' + current);
        return previous + current;
    }, 0.0);
}


module.exports.summarize = summarize;