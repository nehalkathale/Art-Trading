const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tradesSchema = new Schema({
    itemName : {
            type: String,
            required:[true,"Product name is required"]
        },
    itemCategory : {
            type: String,
            required:[true,"Category of product is required"]
        },
    itemSubCategory : {type: String,
            required:[true,"Sub Category of product is required"]
        },
    Description : {
            type: String,
            required:[true,"Description of product is required"],
            minLength : [50,"Description of product should be greater than 50 characters"]
        },
    status : {
            type: String,
        },
    image : {
            type : String,
            required :[true,"Product image is required"],
            default : 'icon.png'
        },
    sku : {
            type : String,
            required:[true,"Category of product is required"]
        },
    artist : {
            type : String,
            required :[true,"Artist name is required"]
        },
    height : {
            type : String,
            required:[true,"Category of product is required"]
        },
    width : {
            type : String,
            required:[true,"Category of product is required"]
        },
    deliveryTime : {
        type : String
    },
    creator: {type: Schema.Types.ObjectId,ref:'User'},
    status:{
        type : String,
        enum: ["available", "pending", "traded"],
        required : [true, "Status is required"],
        default : "available"
    }
},
{timestamps : true}
);
module.exports = mongoose.model('tradeDetails',tradesSchema);