var express=require("express");
var router=express.Router();
var LostItem = require("../models/lost"),
    FoundItem = require("../models/found"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/middleware.js")
//comments new
router.get("/items/:id/comments/new", middleware.isLoggedIn, function(req,res)
{
    // res.send("This will be a comment form");
    LostItem.findById(req.params.id,function(err,foundLostItem)
    {
       if(err)
       {
           console.log(err);
       }
       else if(!foundLostItem)
       {
           FoundItem.findById(req.params.id, function(err, foundFoundItem)
            {
                if(err)
                {
                    console.log("No such Item exists");
                }
                else{
                    if(!foundFoundItem)
                    {
                        res.send("No such item exists, Please go back for more.");
                    }
                    else{
                        res.render("comments/new",{item:foundFoundItem});
                    }
                }
            })
       }
       else{
           res.render("comments/new",{item:foundLostItem});
       }
    });
});

//comments post
router.post("/items/:id/comments",middleware.isLoggedIn,function(req,res)
{
    LostItem.findById(req.params.id,function(err,foundLostItem)
    {
       if(err)
       {
            console.log(err);
       }
       else if(!foundLostItem)
       {
            FoundItem.findById(req.params.id, function(err, foundFoundItem)
            {
                if(err)
                {
                    console.log("No such Item exists");
                }
                else{
                    if(!foundFoundItem)
                    {
                        res.send("No such item exists, Please go back for more.");
                    }
                    else{
                        Comment.create(req.body.comment,function(err,comment)
                        {
                            if(err||!comment)
                            {
                                // if(err){
                                //     req.flash("error",err.message);
                                // }
                                //   console.log(err);
                                    res.redirect("back");
                            }
                            else{
                                // add username and id to the comment
                                comment.author.id=req.user._id;
                                comment.author.username=req.user.username;
                                comment.date=moment().format();

                                comment.save();
                                foundFoundItem.comments.push(comment);
                                foundFoundItem.save();
                                //   console.log(comment);
                                // req.flash("success","Successfully added comment.");
                                res.redirect("/items/"+foundFoundItem._id);
                            }
                        });
                    }
                }
            })
       }
       else{
        //   console.log(req.body.comment);
            Comment.create(req.body.comment,function(err,comment)
            {
                if(err)
                {
                    // if(err){
                    //     req.flash("error",err.message);
                    // }
                    //   console.log(err);
                        res.redirect("back");
                }
                else{
                    // add username and id to the comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.date=moment().format(); 

                    comment.save();
                    foundLostItem.comments.push(comment);
                    foundLostItem.save();
                    //   console.log(comment);
                    // req.flash("success","Successfully added comment.");
                    res.redirect("/items/"+foundLostItem._id);
                }
            });
       }
    });
});

router.get("/items/:id/comments/:comment_id/edit",middleware.checkCommentsOwnership,function(req,res)
{
    // console.log(req.body);
    Comment.findById(req.params.comment_id,function(err,foundComment)
    {
        if(err||!foundComment)
        {
            if(err){
                req.flash("error",err.message);
            }
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{item_id:req.params.id,comment:foundComment});
        }
    })
    
});

// comment update
router.put("/items/:id/comments/:comment_id",middleware.checkCommentsOwnership,function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment)
    {
       if(err||!updatedComment)
       {
        //    if(err){
        //         req.flash("error",err.message);
        //     }
           res.redirect("back");
       }
       else{
        //    req.flash("success","Successfully edited comment.");
           res.redirect("/items/"+req.params.id);
       }
       
    });
});

// comment destroy route
router.delete("/items/:id/comments/:comment_id",middleware.checkCommentsOwnership,function(req,res)
{
    // find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
        {
            // if(err){
            //     req.flash("error",err.message);
            // }
            res.redirect("back");
        }
        else{
            // req.flash("success","Your comment has been deleted.");
            res.redirect("/items/"+req.params.id);
        }
    });
});



module.exports = router;