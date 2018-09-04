var express=require("express");
var router=express.Router();
var passport=require("passport");
LostItem    =require("../models/lost.js"),
FoundItem   =require("../models/found.js")

router.get("/",function(req,res)
{
    res.render("landing"); // landing.ejs
});

//register routes
router.get("/register",function(req,res)
{
    res.render("register");
});

router.post("/register",function(req,res)
{
    // we have somethings here
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            res.redirect("back"); // to register
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/items");
            })
        }
    })
    
});

// Login routes
router.get("/login",function(req,res)
{
    res.render("login");
});

router.post("/login",passport.authenticate("local",
{
    successRedirect:"/items",
    failureRedirect:"/login",
}),
function(req,res)
{

});

router.get("/logout",function(req,res)
{
    req.logout();
    res.redirect("/items");
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