var express=require("express");
var router=express.Router();
LostItem    =require("../models/lost.js"),
FoundItem   =require("../models/found.js")
var middleware = require("../middleware/middleware.js");

router.get("/items",function(req,res)
{
    LostItem.find({},function(err,allLostItems){
        if(err)
        {
            console.log(err);
            // res.send("some error");
        }
        else{ 
            FoundItem.find({},function(err,allFoundItems){
                if(err)
                {
                    console.log(err);
                    // res.send("some error 1");

                }
                else{
                    res.render("items",{lostItems:allLostItems,foundItems:allFoundItems}); 
                }
            
            });
        }
    });
    
});
router.post("/items",middleware.isLoggedIn,function(req,res)
{
    // console.log(req.body);
    // console.log(req.body.isLost);
    var item=req.body.item;
        var details=req.body.details;
        var specifications=req.body.specifications;
        var date=req.body.date;
        var time=req.body.time;
        var author={
            id:req.user._id,
            username:req.user.username
        };
        var itemObject={item:item,details:details,specifications:specifications, date:date ,time:time,author:author};
        console.log("******************************************************")
        console.log(itemObject);
        console.log("******************************************************")

        if(req.body.isLost=="lost"){
        
        LostItem.create(itemObject,function(err,newlyCreated)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                return res.redirect("/items");
            }
        });
    }
    else{
        FoundItem.create(itemObject,function(err,newlyCreated)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                return res.redirect("/items");
            }
        });
    }
});


router.get("/items/new", middleware.isLoggedIn,function(req,res)
{
    res.render("new");
});

router.get("/items/:id",function(req,res)
{

        // ObjectId.fromString( req.params.id ); This needs to be done to remove that casting error

        
    // LostItem.findById(req.params.id, function(err, foundLostItem){
    LostItem.findById(req.params.id).populate("comments").exec(function(err, foundLostItem){
        if(err){
            console.log(err);
            res.redirect("/items");
        }
        else if(!foundLostItem)
        {
            // FoundItem.findById(req.params.id, function(err, foundFoundItem){
            FoundItem.findById(req.params.id).populate("comments").exec(function(err, foundFoundItem){
            
                if(err || !foundFoundItem){
                    console.log("No Such Item exists");
                    res.redirect("/items");
                } else {
                    //render show template with that item
                    res.render("show", {item: foundFoundItem});
                }
            });
        } 
        else {
            // console.log(foundLostItem);
            res.render("show", {item: foundLostItem});
        }
    });
});


router.delete("/items/:id",middleware.checkItemOwnership,function(req,res)
{
   var found = FoundItem.findById(req.params.id);
   if(found){
            FoundItem.findByIdAndRemove(req.params.id,function(err){
                if(err)
                {
                    res.redirect("/items");
                }
                else{
                    
                    if(LostItem.findById(req.params.id))
                    {
                        LostItem.findByIdAndRemove(req.params.id,function(err){
                            if(err)
                            {
                                res.redirect("/items");
                            }
                            else{
                                res.redirect("/items");
                            }
                        });
                    }
                    else{
                        res.redirect("/items");
                    }
                    // res.redirect("/items");
                    
                }
            });
    }
    
});
module.exports = router;