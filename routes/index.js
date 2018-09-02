var express=require("express");
var router=express.Router();
LostItem    =require("../models/lost.js"),
FoundItem   =require("../models/found.js")

router.get("/",function(req,res)
{
    res.render("landing"); // landing.ejs
});

router.get("/team",function(req,res)
{
    res.render("team"); // landing.ejs
});


// to be completed, adds a link to open up images in a seperate tab
router.get("/imageJPG",function(req,res)
{
    var found = FoundItem.findById(req.params.id);
    if(err)
    {
        res.redirect("/items");
    }
    else{
        res.render("displayImage");
    }
});
module.exports = router;