/**
 * Created by sbering on 12/20/13.
 */
module.exports = function(req, res, next) {
    console.log("running middleware...");
    if (!req.isAuthenticated()) {
        console.log("req is not authenticated");
        res.send(401);
    } else {
        console.log("req is authenticated");
        next();
    }
}