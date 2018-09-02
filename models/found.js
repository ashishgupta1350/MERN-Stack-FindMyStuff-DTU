var mongoose=require("mongoose");

var foundItemsSchema=new mongoose.Schema({
    item:String,
    details:String,
    specifications:String,
    date:String,
    time:String
}); 
var FoundItem= mongoose.model("FoundItem",foundItemsSchema);

module.exports = FoundItem;
