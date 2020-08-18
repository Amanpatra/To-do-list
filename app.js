// jshint esversion:6

// npm modules-----------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// ----------------------------------------------


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Connecting with mongoDB-----------------------
mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
// ----------------------------------------------


// Schema of collection Items and Lists----------
const itemSchema = {
    content: String
};
const listSchema = {
    name: String,
    items: [itemSchema]
};
// ----------------------------------------------


// Creating model from respective schema---------
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);
// ----------------------------------------------


// Default content of every list-----------------
const item1 = new Item({
    content: "Welcome to Your To-do list"
})
const item2 = new Item({
    content: "Click + to add new item"
})
const item3 = new Item({
    content: "<-- Hit this to delete"
})
// ----------------------------------------------


// All routes for get and post methods-----------
app.get("/", function(req, res){

    Item.find(function(err, foundList) {
        if(!err) {
            if(foundList.length === 0) {
                Item.insertMany([item1, item2, item3], function(err) {
                    if(!err) {
                        res.redirect("/");
                    }
                });
            }
            else {
                res.render("list", {listTitle: "Today",listItems: foundList});
            }
        }
    })
})

app.post("/", function(req, res){

    const newContent = req.body.newItem;
    const listTitle = req.body.listType;

    const newItem = new Item({
        content: newContent
    });

    if(listTitle === "Today") {
        Item.insertMany([newItem], function(err) {
            if(!err) {
                res.redirect("/");
            }
        });
    }
    else {
        List.findOneAndUpdate({name: listTitle}, {$push: {items: newItem}}, function(err) {
            if(!err) {
                res.redirect("/"+listTitle);
            } 
        })  
    }
})

app.post("/delete", function(req, res){

    const checkedItemId = req.body.contentId;
    const listTitle = req.body.customListName;

    if (listTitle === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if(!err) {
                res.redirect("/");
            }
        })
    }
    else {
        List.findOneAndUpdate({name: listTitle}, {$pull: {items: {_id: checkedItemId}}}, function(err) {
            if(!err) {
                res.redirect("/"+listTitle);
            }
        })
    }
})

app.get("/:customList", function(req, res){

    const customListName = _.capitalize(req.params.customList);
    List.findOne({name: customListName}, function(err, foundList) {
        if (!err) {
            if(foundList) {                
                res.render("list", {listTitle: customListName, listItems: foundList.items});
            }
            else {
                const newCustomList = new List({
                    name: customListName,
                    items: [item1, item2, item3]
                })
                newCustomList.save();
                res.redirect("/" + customListName);
            }
        }
        
    })
})
// ----------------------------------------------


// To listen on port 3000------------------------
app.listen(3000, function(){
    console.log("Server running on port 3000");
})
// ----------------------------------------------