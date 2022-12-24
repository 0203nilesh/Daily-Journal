//jshint esversion:6
const mongoose= require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash= require("lodash");

const homeTitle= "Hello";
const homeContent = "Welcome to the Daily Journal website. You can add your custom posts by going into the /compose.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
// const posts= [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Database connection
mongoose.set('strictQuery', false);
// mongo "mongodb+srv://cluster0.1shr1pe.mongodb.net/DailyJournalDB" --apiVersion 1 --username DailyJournal
const url= "mongodb+srv://DailyJournal:Daily123Journal@cluster0.1shr1pe.mongodb.net/DailyJournalDB";
mongoose.connect(url, {useNewUrlParser: true}, function(err){
  if(!err){
    console.log("Success");
  }
});

const postSchema= mongoose.Schema({
    title: String,
    content: String
})
const Post= mongoose.model ("Post", postSchema);

const homeDefaultPost= new Post ({
  title: homeTitle,
  content: homeContent
})


app.get("/", (req, res)=>{
  Post.find({},async function(err, data){
    if(!err){
      if(data.length === 0 ){
        await homeDefaultPost.save(function(err){
          if(!err){
            console.log('success');
            res.redirect("/");
          }
        });
      }
      else{
        // console.log(data);
        res.render("home", { posts: data});
      }
    }
  })
})

app.get("/about", (req, res)=>{
  res.render("about", {aboutStartingContent: aboutContent});
})

app.get("/contact", (req, res)=>{
  res.render("contact", {contactStartingContent: contactContent});
})

app.get("/compose", (req, res)=>{
  res.render("compose");
})

app.get("/posts/:postName",  (req, res)=>{
  const requestedTitle= lodash.lowerCase(req.params.postName) ;
   Post.find({}, function(err, data){
    if(!err){
       data.map((post)=>{
        const requiredTitle= lodash.lowerCase(post.title);
        if(requestedTitle=== requiredTitle){
          console.log("Match Found!");
          res.render("post", {postTitle: post.title, postContent: post.content})
        }
      })
    }
  })
  // res.send("NOt found");
})
app.post("/compose", async (req, res)=>{
  const postData= new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  })
 await postData.save(function(err){
    if(!err){
      console.log("Success");
      res.redirect("/");
    }
  })
  // posts.push(postData);
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
