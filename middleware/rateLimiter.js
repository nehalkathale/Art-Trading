const rateLimit = require('express-rate-limit')

exports.loginLimiter= rateLimit({
    windowMS : 60 * 1000,
    max : 5,
    //message: "To many login request. Try again later"
    handler: (req,res,next) =>{
        let err = new Error("To many login request. Try again later")
        err.status = 429;
        return next(err);
    }
}) 