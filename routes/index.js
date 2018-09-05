var express=require("express");
var router=express.Router();
LostItem    =require("../models/lost.js"),
FoundItem   =require("../models/found.js"),
middleware      =require("../middleware/middleware.js")


router.get("/",function(req,res)
{
    res.render("landing"); // landing.ejs
});

router.get("/team",function(req,res)
{
    res.render("team"); // landing.ejs
});

// REGISTER ROUTES
router.get("/register",function(req,res)
{
    res.render("register");
});

router.post("/register",function(req,res)
{   
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log("In items.js, unable to register user");
            console.log(err);
            res.redirect("back")
        }
        else{
            passport.authenticate("local")(req,res,function()
            {
                console.log("successfully registered user",req.user);
                res.locals.currentUser=req.user;
                res.redirect("/items");
            });
        }
    });
});
// login routes
router.get("/login",function(req,res)
{
    res.render("login");
});

router.post("/login",passport.authenticate('local',{
    successRedirect:'/items',
    failureRedirect:"/login"
}));

//signout
router.get("/logout",function(req,res)
{
    req.logout();
    res.redirect("/items");
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