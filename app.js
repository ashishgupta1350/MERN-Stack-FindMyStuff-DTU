var express     =require("express"),
    mongoose    =require("mongoose"),
    bodyParser  =require("body-parser"),
    methodOverride=require("method-override")

var app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/findMyStuffDB");


var lostItemsSchema=new mongoose.Schema({
    item:String,
    details:String,
    specifications:String,
    date:String,
    time:String
}); 
var LostItem= mongoose.model("LostItem",lostItemsSchema);
var foundItemsSchema=new mongoose.Schema({
    item:String,
    details:String,
    specifications:String,
    date:String,
    time:String
}); 
var FoundItem= mongoose.model("FoundItem",foundItemsSchema);

app.get("/",function(req,res)
{
    res.render("landing"); // landing.ejs
});

app.get("/items",function(req,res)
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
app.post("/items",function(req,res)
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


app.get("/items/new",function(req,res)
{
    res.render("new");
});


app.get("/items/:id",function(req,res)
{

    LostItem.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err);
            res.redirect("/items");
        } else {
            if(LostItem.findById(req.params.id)) // if the item is not undefined then just render else:
                res.render("show", {item: foundItem});
            else{
                FoundItem.findById(req.params.id, function(err, foundItem){
                    if(err){
                        console.log(err);
                        res.redirect("/items");
                    } else {
                        //render show template with that campground
                        res.render("show", {item: foundItem});
                    }
                });
            }
        }
    });
});

app.delete("/items/:id",function(req,res)
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

// to be completed, adds a link to open up images in a seperate tab
app.get("/imageJPG",function(req,res)
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

app.listen(3000,function()
{
    console.log("The FindMyStuff server has started!");
});


