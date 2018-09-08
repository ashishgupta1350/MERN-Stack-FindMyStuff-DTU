var mongoose=require("mongoose");

var lostItemsSchema=new mongoose.Schema({
    item:String,
    details:String,
    specifications:String,
    date:String,
    time:String,
    location: String,
    lat: Number,
    lng: Number,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
}); 
var LostItem= mongoose.model("LostItem",lostItemsSchema);

module.exports = LostItem;