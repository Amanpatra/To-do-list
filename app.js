//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const items = ["Eat", "Code", "Sleep"];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    var today = new Date();
    var option = {
        day: "numeric",
        weekday: "long",
        month: "long",

    }
    var day = today.toLocaleString("en-US", option);

    res.render("list", {listTitle: day,listItems: items})
})

app.post("/", function(req, res){

    const item = req.body.newItem;
    // let title = req.body.listType;

    // title = title.split(" ", 1);
    // console.log(title);

    if (req.body.listType === "Work"){
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
    
})

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List",listItems: workItems})
})

app.listen(3000, function(){
    console.log("Server running on port 3000");
})