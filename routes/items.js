var express=require("express");

var router=express.Router();
LostItem    =require("../models/lost.js"),
FoundItem   =require("../models/found.js")
var middleware = require("../middleware/middleware.js");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

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
                    console.log("Some error while finding the items in items.js")
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
        var lat,lng,location;
       
        location=req.body.location;
        geocoder.geocode(req.body.location, function (err, data) {

           
            if (err || !data.length) {
            //   req.flash('error', 'Invalid address');
              return res.redirect('back');
            }
            
            lat = data[0].latitude;
            lng = data[0].longitude;
            location = data[0].formattedAddress;
            var itemObject={item:item,details:details,specifications:specifications, date:date ,time:time,author:author,location:location,lat:lat,lng:lng};

        

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
        
});


router.get("/items/new", middleware.isLoggedIn,function(req,res)
{
    res.render("new2");
});

router.get("/items/:id",function(req,res)
{
        // ObjectId.fromString( req.params.id ); This needs to be done to remove that casting error

    // LostItem.findById(req.params.id, function(err, foundLostItem){
    console.log(req.params.id)
    
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

router.get("/items/:id/edit",function(req,res)
{
    console.log(req.params);
    LostItem.findById(req.params.id,function(err, foundLostItem){
        if(err){
            console.log(err);
            res.redirect("/items");
        }
        else if(!foundLostItem)
        {
            // FoundItem.findById(req.params.id, function(err, foundFoundItem){
            FoundItem.findById(req.params.id,function(err, foundFoundItem){
            
                if(err || !foundFoundItem){
                    console.log("No Such Item exists");
                    res.redirect("/items");
                } else {
                    //render show template with that item
                    res.render("edit", {item: foundFoundItem});
                }
            });
        } 
        else {
            // console.log(foundLostItem);
            res.render("edit", {item: foundLostItem});
        }
    });
});

router.put("/items/:id",middleware.checkItemOwnership,function(req,res)
{
    
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
        //   req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.item.lat = data[0].latitude;
        req.body.item.lng = data[0].longitude;
        req.body.location = data[0].formattedAddress;
        console.log("----------------------------------------------------------------------");
        console.log(req.body.item);
        console.log("----------------------------------------------------------------------");

        if(req.body.item.isLost=="lost")
        {
            LostItem.findByIdAndUpdate(req.params.id, req.body.item, function(err, item){
                if(err||!item){
                    // req.flash("error", err.message);
                    console.log(err);
                    res.redirect("back");
                } else {
                    // req.flash("success","Successfully Updated!");
                    res.redirect("/items/" + item._id);
                }
            });
        } else {
            FoundItem.findByIdAndUpdate(req.params.id, req.body.item, function(err, item){
                if(err||!item){
                    // req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    // req.flash("success","Successfully Updated!");
                    res.redirect("/items/" + item._id);
                }
            });
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