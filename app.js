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
    Comment         =require("./models/comment"),
    GoogleStrategy  =require('passport-google-oauth').OAuth2Strategy,
    findOrCreate    =require("mongoose-findorcreate"),
    moment          =require("moment")
var app=express();
app.use(methodOverride("_method"));

// THE GOOGLE CODE ----------------------------------------

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: "1027907136363-gutrdtbdjdi4q7tq7c6vmb3rsnu2c0v2.apps.googleusercontent.com",
    clientSecret: "g28XDv5VxQhQgX3i4ET4sq2S" ,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // User.register({ username: profile.name.givenName }, function (err, user) {

        //     return done(err, user);
        // });
        var localUser;
        var localError;
        var newUser=new User({username:profile.nickname});
        User.register(newUser,profile.name.givenName,function(err,user)
        {
            localUser=user;
            localError=err;
        });
        return done(localUser, localError);

        // var newUser=new User({username:profile.nickname});
        // User.register(newUser,profile.nickname+'DTU',function(err,user)
        // {
        //     // passport.authenticate("google")(req,res,function()
        //     // {
        //     //     console.log("Successfully registered user",req.user);
        //     //     res.locals.currentUser= user;
        //     //     // res.redirect("/");
        //     // });
        //     // passport.authenticate("local")(req,res,function()
        //     // {
        //     //     console.log("successfully registered user",req.user);
        //     //     res.locals.currentUser=user;
        //     //     // res.redirect("back");
        //     // });
        //     passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] });
        //     return done(err,user);
        // }) // nicknameDTU is the password
        // console.log(profile,User);
    }
));


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/items');
  });

// THE GOOGLE CODE ENDS --------------------------------------------

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

app.listen(4004,function()
{
    console.log("The FindMyStuff server has started!");
});


