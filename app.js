var express     =require("express"),
    mongoose    =require("mongoose"),
    bodyParser  =require("body-parser")

var app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");




var lostItems=[
    {item:"perygarden pen",details:"item details",specifications:"Item specifics go here", date:"29,August,2019",time:"12:10am"},
    {item:"fdaskhfak",details:"fdsklhfladskjfla details",specifications:"asdkfalmv,vm,mjapodsjfp", date:"29,August,2019",time:"12:10am"},
    {item:"afdsjrqwpeoi ",details:"HALDFSALFAL",specifications:"Item FSDAJFDASKL;A go here", date:"29,August,2019",time:"12:10am"},
    {item:"FDJKA pen",details:"item details",specifications:"Item specifics go here", date:"29,August,2019",time:"12:10am"},
    {item:"jfsdakfoewqtiq pen",details:"jfdksvz.,mvzputweq details",specifications:"Item specifics go here", date:"29,August,2019",time:"12:10am"},
    {item:"perygarden pen",details:"item details",specifications:"Item specifics go here", date:"29,August,2019",time:"12:10am"}

];
var foundItems=[
    {item:"perygarden pen",details:"item details",specifications:"Item specifics go here", date:"29,August,2019",time:"12:10am"},
    {item:"fdaskhfak",details:"fdsklhfladskjfla details",specifications:"asdkfalmv,vm,mjapodsjfp", date:"29,August,2019",time:"12:10am"},
    {item:"afdsjrqwpeoi ",details:"HALDFSALFAL",specifications:"Item FSDAJFDASKL;A go here", date:"29,August,2019",time:"12:10am"},
    {item:"FDJKA pen",details:"item details",specifications:"Item specifics go here", date:"29,August,2019",time:"12:10am"},
    {item:"jfsdakfoewqtiq pen",details:"jfdksvz.,mvzputweq details",specifications:"Item specifics go here", date:"29,August,2019",time:"12:10am"},
    {item:"perygarden pen",details:"item details",specifications:"Item specifics go here", date:"29,August,2019",time:"12:10am"}

]

app.get("/",function(req,res)
{
    res.render("landing"); // landing.ejs
});

app.get("/items",function(req,res)
{
    res.render("items",{lostItems:lostItems,foundItems:foundItems}); // it should also pass the campgrounds
})

app.get("/items/new",function(req,res)
{
    res.render("new");
});
app.listen(3000,function()
{
    console.log("The FindMyStuf server has started!");
});


