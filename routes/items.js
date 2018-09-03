var express=require("express");
var router=express.Router();
LostItem    =require("../models/lost.js"),
FoundItem   =require("../models/found.js")

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
router.post("/items",function(req,res)
{
    // console.log(req.body);
    // console.log(req.body.isLost);
    var item=req.body.item;
        var details=req.body.details;
        var specifications=req.body.specifications;
        var date=req.body.date;
        var time=req.body.time;
        var itemObject={item:item,details:details,specifications:specifications, date:date ,time:time};
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


router.get("/items/new",function(req,res)
{
    res.render("new");
});

router.get("/items/:id",function(req,res)
{
    // console.log(FoundItem.findById(req.params.id, req.params));
    LostItem.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err);
            res.redirect("/items");
        } else {
            if(!foundItem)
            {
                console.log("Found item");
                FoundItem.findById(req.params.id, function(err, foundFoundItem){
                    if(err){
                        console.log(err);
                        res.redirect("/items");
                    } else {
                        //render show template with that campground
                        res.render("show", {item: foundFoundItem});
                    }
                });
            }
            else if(LostItem.findById(req.params.id)){ // if the item is not undefined then just render else:
                console.log("Here in wrong place");
                console.log(foundItem)
                res.render("show", {item: foundItem});
            }
            else{
                res.redirect("/items");
            }
            
        }
    });
});

router.delete("/items/:id",function(req,res)
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