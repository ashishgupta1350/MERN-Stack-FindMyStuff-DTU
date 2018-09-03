var express     =require("express"),
    mongoose    =require("mongoose"),
    bodyParser  =require("body-parser"),
    methodOverride=require("method-override")
    passport    =require("passport"),
    LocalStrategy   =require("passport-local"),     
    User            =require("./models/user"),
    LostItem    =require("./models/lost.js"),
    FoundItem   =require("./models/found.js")

var app=express();
var itemsRoute=require("./routes/items"),
    indexRoute=require("./routes/index")

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
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


app.use(itemsRoute);
app.use(indexRoute);

app.listen(3000,function()
{
    console.log("The FindMyStuff server has started!");
});


