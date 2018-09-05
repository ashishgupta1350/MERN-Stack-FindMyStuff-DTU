var express         =require("express"),
    mongoose        =require("mongoose"),
    bodyParser      =require("body-parser"),
    methodOverride  =require("method-override")
    passport        =require("passport"),
    LocalStrategy   =require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose")
    User            =require("./models/user"),
    LostItem        =require("./models/lost.js"),
    FoundItem       =require("./models/found.js"),
    everyauth       =require("everyauth"),
    middleware      =require("./middleware/middleware.js"),
    Comment         =require("./models/comment")


var app=express();

app.use(methodOverride("_method"));

var itemsRoute=require("./routes/items"),
    indexRoute=require("./routes/index"),
    commentRoute=require("./routes/comment")

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/findMyStuffDB");

app.use(require("express-session")({
    secret:"Session for Find My Stuff DTU",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next)
{
    // req.locals.currentUser=req.user;
    res.locals.currentUser=req.user;
    next(); // this turns on the middle ware
});

// IMPORTANT NOTE -- DO NOT DELETE

// USE THE CURRENT USER ROUTE AFTER APP.USE (PASSPORT) AND BEFOOOOOORE APP.USE (ITEMS ROUTE)
// REFER https://www.udemy.com/the-web-developer-bootcamp/learn/v4/t/lecture/3861700?start=0

app.use(itemsRoute);
app.use(indexRoute);
app.use(commentRoute);

app.listen(3000,function()
{
    console.log("The FindMyStuff server has started!");
});


