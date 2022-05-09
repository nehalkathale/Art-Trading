const tradeModel = require ('../models/tradeModels');
const offerModel = require('../models/offerModels');
const userModel = require('../models/userModels');
const watchListModel = require('../models/watchListModels')
const flash = require('connect-flash/lib/flash');
exports.createTrade = (request,response,next)=>{
    let id = request.session.user;
    let tradeId = request.params.id;
    console.log(request.body)
    tradeModel.find({creator:id,status:"available"})
    .then((trades)=>{
        response.render('./trade/offerTradeList', {trades,tradeId})
    }).catch(error=>{
        if(error.name === "ValidationError")
            error.status = 400;
        next(error);
    })
}

exports.createTradeRequest = (request,response,next)=>{
    let fromUserId = request.session.user;
    let offerOn = request.body.offerOn;
    let offerFor = request.body.offerFor;
    tradeModel.findOne({_id:offerOn})
    .then((trades)=>{
        let toUserId = trades.creator;
        let tradeDetails = {
            requestFrom : fromUserId,
            requestTo : toUserId,
            exchangeArt : offerOn,
            requestedArt : offerFor,
            status : "pending"
        }
        let offerModelDetails = new offerModel(tradeDetails);
        offerModelDetails.save(tradeDetails)
        .then((offerDetails)=>{
            tradeModel.update({_id:offerFor},{$set:{status:"pending"}},{multi: true})
            .then((tradesUpdated)=>{
                offerModel.find({"requestFrom":fromUserId,"status":{$ne:"closed"}}).populate('requestFrom')
                .populate('requestTo')
                .populate('exchangeArt')
                .populate('requestedArt')
                .then(myOffers=>{
                    response.redirect('/tradeRequest/userRequestedTrades')
                }).catch(error=>{
                    console.log(error)
                    request.flash('error',"Error in retrieving your trade request");
                    response.redirect('/')
                })
                
            }).catch(error=>{
                error.status = 400;
                next(error);
            })
        })
        .catch(error=>{
            console.log(error)
            request.flash('error',"Error in making trade request");
            next(error);
        })
        
    })
    .catch(error=>{
        error.status = 400;
        request.flash('error',"Cannot find trade id: "+offerOn);
        next(error);
    })
}

exports.getMyTradeRequests = (request,response,next)=>{
    let userId = request.session.user
    offerModel.find({'requestFrom':userId,"status":{$nin:["closed","accepted","rejected"]}})
        .populate('requestFrom')
        .populate('requestTo')
        .populate('exchangeArt')
        .populate('requestedArt').then(myOffers=>{
            response.render('./user/myTradeRequests', {myOffers})
        }).catch(error=>{
            console.log(error)
            request.flash('error',"Error in retrieving your trade request");
            response.redirect('/')
        })
}

exports.getTradeRequestForMe = (request,response,next)=>{
    let userId = request.session.user
    offerModel.find({'requestTo':userId,"status":{$nin:["closed","accepted","rejected"]}})
        .populate('requestFrom')
        .populate('requestTo')
        .populate('exchangeArt')
        .populate('requestedArt').then(myOffers=>{
            response.render('./user/tradeRequestsForMe', {myOffers})
        }).catch(error=>{
            console.log(error)
            request.flash('error',"Error in retrieving your trade request");
            response.redirect('/')
        })
}

exports.deleteTrade = (request,response,next) =>{
    let tradeId = request.params.id; 
    console.log("TradeId",tradeId)
    let userID = request.session.user
    console.log("UserId",userID)
    offerModel.findOne({
        requestFrom: userID,
        _id: tradeId
      }).then(trade => {
        if (!trade) {
          throw new Error("No such trade request");
        }else{
            let fromTrade = trade.requestedArt._id;
            console.log("fromTrade",fromTrade)
            tradeModel.findByIdAndUpdate(fromTrade,{status:"available"},{useFindAndModify:false, runValidators:true})
            .then(updatedArt=>{
                return updatedArt;
            }).catch(error=>{
                console.log(error)
            })
        }
        return trade.update({status: "closed"});
      }).then(() => {
        response.redirect("/tradeRequest/userRequestedTrades");
      }).catch(err => {
        console.log(err);
        request.flash('error','Error in deleting offer');
        response.redirect("/tradeRequest/userRequestedTrades");
      });
}

exports.acceptTrade = (request,response,next) =>{
    let userId = request.session.user;
    console.log("User id is",userId)
    let tradeId = request.params.id;
    console.log("Trade id is",tradeId)
    offerModel.findOne({_id: tradeId, requestTo: userId})
    .populate('requestFrom')
    .populate('requestTo')
    .populate('requestedArt')
    .populate('exchangeArt')
    .then(trade=>{
        if(!trade){
            throw new Error("No such trade request");
        }
        let tradeRequestedBy = trade.requestFrom._id;
        return offerModel.rejectTradeRelateToArts(trade).then(() => {
            trade.requestedArt.creator = trade.requestTo._id;
            trade.requestedArt.status = "available";
            return trade.requestedArt.save();
          }).then(() => {
            if (trade.exchangeArt) {
              trade.exchangeArt.creator = tradeRequestedBy;
              trade.exchangeArt.status = "available";
              return trade.exchangeArt.save();
            }
          }).then(() => {
            trade.status = "accepted";
            return trade.save();
          }).then(() => {
            response.redirect("/tradeRequest/tradeRequestForUser");
          });
    }).catch(err => {
        request.flash('error','Error in accepting offer, try again');
        response.redirect("/tradeRequest/tradeRequestForUser");
        console.log(err)
    });
};

exports.rejectTrade = (request,response,next) =>{
    let userId = request.session.user;
    let tradeId = request.params.id;
    console.log("userId",userId);
    console.log("tradeId",tradeId);
    offerModel.findOne({_id: tradeId, requestTo: userId})
    .populate('requestFrom')
    .populate('requestTo')
    .populate('requestedArt')
    .populate('exchangeArt')
    .then(trade=>{
        trade.update({status:"rejected"}).then(tradeUpdated=>{
            let fromTrade = trade.requestedArt._id;
            console.log("fromTrade",fromTrade)
            return tradeModel.findByIdAndUpdate(fromTrade,{status:"available"},{useFindAndModify:false, runValidators:true})
            .then(()=>{
                response.redirect("/tradeRequest/tradeRequestForUser");
            })   
        })
    }).catch(error=>{
        next(error);
    })
}