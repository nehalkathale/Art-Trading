const tradeModel = require ('../models/tradeModels')
var randomize = require('randomatic');
const watchList = require('../models/watchListModels')

exports.index = (request,response,next)=>{
    tradeModel.find()
  .then((trades)=>{
    let categories = [...
      new Set(trades.map(
        (object) => {
          return object.itemCategory
        })
  )];
    response.render('./trade/trades', {trades,categories})
  })
  .catch(error=>next(error))
}

exports.new = (request,response)=>{
    response.render('./trade/newTrade');
}

exports.createNewTrade = (request,response,next) =>{
  let file = request.file;
  let tradeDetail = new tradeModel(request.body);
  tradeDetail.image = file.originalname;
  let sku = "The Art Store" + randomize('Aa0', 10);
  tradeDetail.sku = sku;
  tradeDetail.creator = request.session.user;
  console.log("USer is: " + request.session.user );
  tradeDetail.save()
    .then((tradeDetail)=>{
        response.redirect('/trades');
    })
    .catch(error=>{
        if(error.name === "ValidationError"){
            error.status = 400;
        }
        next(error);
    });
}

exports.getDetailsByID = (request,response,next)=>{
    let id = request.params.id;
    let userId = request.session.user;
    tradeModel.findById(id).populate('creator','firstName lastName')
    .then(tradeDetails=>{
        if(tradeDetails){
            watchList.find({tradeId : id,userId : userId})
            .then((watchList)=>{
                if(watchList.length > 0){
                    let addedToWatchList = true;
                    response.render('./trade/trade',{tradeDetails,addedToWatchList});
                }else{
                    let addedToWatchList = false;
                    response.render('./trade/trade',{tradeDetails,addedToWatchList});
                } 
            }).catch(error=>{
                next(error)
            });
        }else{
            let error = new Error('Cannot find a trade with id ' + id);
            error.status = 404;
            next(error);
        }
    })
    .catch(error=>{
        next(error)
    })   
}; 


exports.edit = (request,response,next) => {
    let id = request.params.id;
    tradeModel.findById(id)
    .then(trade=>{
        if(trade){
            return response.render('./trade/editTrade', {trade});
        }else{
            let error = new Error('Cannot find a trade with id ' + id);
            err.status = 404;
            next(error);
        }
    })
    .catch(error=>{
        next(error)
    })
}

exports.updateElementByID = (request,response,next) =>{
    let tradeDetail = request.body;
    let fileDetails = request.file;
    tradeDetail.image = fileDetails.originalname;
    let id = request.params.id;
    tradeModel.findByIdAndUpdate(id,tradeDetail,{useFindAndModify:false, runValidators:true})
    .then(tradeDetail=>{
        if(tradeDetail){
            response.redirect('/trades/'+id); 
        }else {
            let error = new Error('Cannot find a tradeDetail with id ' + id);
            error.status = 404;
            next(error);
        }
    })
    .catch(error=>{
        if(error.name === "ValidationError"){
            error.status = 400;
        }
        next(error);
    })
    
};


exports.deleteElementByID = (request,response,next) =>{
    let id = request.params.id;
    tradeModel.findByIdAndDelete(id,{useFindAndModify:false})
    .then(trade=>{
        if(trade){
            response.redirect('/trades'); 
        }else {
            let error = new Error('Cannot find a trade with id ' + id);
            error.status = 404;
            next(error);
        }
    })
    .catch(error=>{
        if(error.name === "ValidationError"){
            error.status = 400;
        }
        next(error);
    })
}

exports.addToWatchList = (request,response,next) =>{    
    let tradeId = request.params.id;
    let userId = request.session.user;
    let addToWatchList = new watchList({tradeId : tradeId,userId : [userId]});
    //check if trade is already in favorite list, if already present don't do anything else add to favorites and display
    watchList.findOne({userId : userId})
    .then((watchListReceived)=>{
        if(!watchListReceived){
            addToWatchList.save()
            .then(()=>{
                response.redirect('/trades/'+tradeId); 
            }).catch(error=>{
                if(error.name === "ValidationError"){
                    error.status = 400;
                }
            });    
        }else{
            if(watchListReceived.tradeId.indexOf(tradeId) > -1) {
                request.flash('error','Already added to favorite elements')
            } else {
                watchListReceived.tradeId.push(tradeId);
                watchListReceived.save()
                .then(()=>{
                    response.redirect('/trades/'+tradeId); 
                })
                .catch(error=>{
                    if(error.name === "ValidationError"){
                        error.status = 400;
                    }
                    next(error);
                });
                
            }
        }
    });
}

exports.removeFromWatchList = (request,response,next) =>{    
    let tradeId = request.params.id;
    let userId = request.session.user;
    watchList.findOne({userId : userId,tradeId:tradeId})
    .then((list)=>{
        list.tradeId.remove(tradeId);
        list.save()
        .then(()=>{
            response.redirect('/trades/'+tradeId);
        })
    }).catch(error=>{
        if(error.name === "ValidationError")
            error.status = 400;
        next(error);
    })
}



