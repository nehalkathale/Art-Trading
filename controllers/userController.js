const User = require('../models/userModels');
const tradesModel = require('../models/tradeModels')
const watchList = require('../models/watchListModels')
exports.new = (req, res)=>{
    res.render('./user/new');
};

exports.addUser = (request,response,next)=>{
    let user = new User(request.body);
    user.save()
    .then(()=>{
        response.render('./user/login')
    })
    .catch(error=>{
        if(error.name === 'ValidationError'){
            request.flash('error',error.message)
            return response.redirect('/user/new')
        }
        if(error.code === 11000){
            request.flash('error','Email address has been used');
            return response.redirect('/user/new')
        }
        next(error)
    });
};

exports.login = (request,response)=>{
    response.render('./user/login')
};

exports.loginUser = ('/login',(request,response,next)=>{
    let email = request.body.email
    let password = request.body.password;

    User.findOne({email:email})
    .then(user=>{
        if(user){
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    request.session.user = user._id;
                    request.flash('success','You have successfully logged in')
                    response.redirect('../user/profile');
                }else{
                    request.flash('error','Wrong Password')
                    response.redirect('/user/login')
                }
            })
            .catch(error=>next(error))
        }else{
            request.flash('error','Wrong Email address')     
            response.redirect('/user/login')
        }

    }).catch(error=>next(error));
});

exports.profile = (request,response)=>{
    let id = request.session.user;
    Promise.all([User.findById(id),tradesModel.find({creator:id})]) 
    .then(results=>{
        const [user,trades] = results;
        let categories = [...
            new Set(trades.map(
              (object) => {
                return object.itemCategory
              })
        )];
        response.render('./user/profile', {user,trades,categories})
    })
    .catch(err=>next(err));
};

exports.userWatchList = (request,response,next)=>{
    let id = request.session.user; 
    let trades=[],categories,user;
    Promise.all([watchList.findOne({userId:id})])
    .then((results)=>{
        const[trade,userDetails] = results;
        if(trade){
            tradesModel.find({_id:{$in :trade.tradeId}})
            .then((tradeDetails)=>{
            categories = [...
                new Set(tradeDetails.map(
                (object) => {
                    return object.itemCategory
                })
            )];
            trades = tradeDetails;
            user = userDetails
            response.render('./user/watchList', {trades,categories}) 
        })
        }else{
            response.render('./user/watchList', {trades,categories})
        }
        
    }).catch(err=>next(err));
}
exports.logout = (request,response,next)=>{
    request.session.destroy(error=>{
        if(error){
            return next(error)
        }else{
            response.redirect('/user/login')
        }
    })
};




