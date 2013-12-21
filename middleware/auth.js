/**
 * Created by sbering on 12/20/13.
 */
module.exports = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.send(401);
    } else {
        next();
    }
}