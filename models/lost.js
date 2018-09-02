var mongoose=require("mongoose");

var lostItemsSchema=new mongoose.Schema({
    item:String,
    details:String,
    specifications:String,
    date:String,
    time:String
}); 
var LostItem= mongoose.model("LostItem",lostItemsSchema);

module.exports = LostItem;