const trade = require('../models/tradeModels')
//Check if user is a guest
exports.isGuest = (req,res,next)=>{
    if(!req.session.user)
        return next();
    else{
        req.flash('error','You are logged in already')
        console.log("Already logged in")
        return res.redirect('/user/profile')
    }
};

//Check if user is authenticated
exports.isLoggedIn = (req,res,next)=>{
    if(req.session.user)
        return next();
    else{
        req.flash('error','You need to login first')
        return res.redirect('/user/login')
    }
};

//Check if user is author of trade
exports.isAuthor=(req,res,next)=>{
    let id = req.params.id
    trade.findById(id)
    .then(trade=>{
        if(trade){
            if(trade.creator == trade.session.user){
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource.');
                err.status = 401;
                return next(err);
            }
        }
    })
    .catch(error=>{

    })
};