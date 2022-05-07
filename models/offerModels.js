const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const offerSchema = new Schema({
    requestFrom : {
        type: Schema.Types.ObjectId,ref:'User',
    },
    requestTo : {
        type: Schema.Types.ObjectId,ref:'User',
    }, 
    requestedArt:{
        type: Schema.Types.ObjectId,ref:'tradeDetails',
    },
    exchangeArt :{
        type: Schema.Types.ObjectId,ref:'tradeDetails',
    },
    status :{
        type : String,
        enum: ["opened", "closed", "rejected", "accepted","pending"],
        required : [true, "Status is required"],
    }
});

offerSchema.statics.rejectTradeRelateToArts = function (trade){
    let offerRequest = this;
    return offerRequest.update({
        status: "opened",
         requestedArt: trade.requestedArt._id,
        _id: {
          $ne: trade._id
        }
      }, {status: "rejected"}, {multi: true})
    
        .then(() => {
          return offerRequest.update({
            status: "opened",
            exchangeArt: trade.requestedArt._id
          }, {status: "closed"}, {multi: true});
        })
        .then(() => {
          if (trade.exchangeArt) {
            return offerRequest.update({
              status: "opened",
              exchangeArt: trade.exchangeArt._id,
              _id: {
                $ne: trade._id
              }
            }, {status: "closed"}, {multi: true});
          }
        })
        .then(() => {
          if (trade.exchangeArt) {
            return offerRequest.update({
              status: "opened",
              requestedArt: trade.exchangeArt._id
            }, {status: "closed"}, {multi: true});
          }
        });
}
module.exports = mongoose.model('Offers',offerSchema);
