// It was named as index.js as it is auto required in requiring the dir inside of routes files campgrounds and comments
var middlewareObj = {};
var LostItem = require("../models/lost"),
    FoundItem = require("../models/found")

// best way to define it acc to me:)
middlewareObj.checkItemOwnership=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        // good to go
        // does the user owns the campground
        LostItem.findById(req.params.id,function(err,foundLostItem)
        {
            if(err)
            {
                // req.flash("error","Campground not found!");
                console.log("Not found Lost item")
                res.redirect("/items");
            }
            else if(!foundLostItem){
                FoundItem.findById(req.params.id,function(err,foundFoundItem)
                {
                    if(err){
                        console.log("some error in found item in middleware");
                        res.redirect("/items");
                    }
                    else if(!foundFoundItem){
                        console.log("Invalid Item");
                        res.redirect("/items");
                    }
                    else{
                        if(foundFoundItem && foundFoundItem.author.id.equals(req.user._id))
                        {
                            next();
                        }
                        else{
                            res.send("You are not authorised to complete this action!");
                        }
                    }
                });
                
            }
            else{
                
                if(foundLostItem.author.id.equals(req.user._id))
                {
                     next();
                     
                }else{
                    res.send("You are not authorised to complete this action!");
                }
            }
        });
    }
    else{
        console.log("You need to be logged in to perform that action!")
        res.redirect("/login");
    }
};
// middlewareObj.checkCommentsOwnership=function(req,res,next)
// {
//     if(req.isAuthenticated())
//     {
//         Comment.findById(req.params.comment_id,function(err,foundComment)
//         {
//            if(err||!foundComment)
//            {
//             //   console.log(err);
//               if(err){
//                 req.flash("error",err.message);
//             }
//               res.redirect("back");
//            }
//            else{
//             //   console.log(foundComment);
//             //   console.log(req.user);
//                if(foundComment.author.id.equals(req.user._id))
//                {
//                    next();
//                }else{
//                 //   res.send("Not authorized to change/delete");
//                     req.flash("error","You are not authorized.");
//                    res.redirect("back");
//                }
//            }
//         });
//     }
//     else{
//         // console.log("You need to be logged in first");
//         req.flash("error","You need to be logged in to do that.");
//         res.redirect("back");
//     }
// };

middlewareObj.isLoggedIn= function(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    // req.flash("error","You need to be logged in to do that."); // in flash, add this flash!
    res.redirect("/login");
}

module.exports=middlewareObj;