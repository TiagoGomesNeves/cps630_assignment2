const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const multer = require('multer');
const upload = multer({dest: '../frontend/public/images'});

const PORT = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

// For frontend requests
app.use(cors());


//Database Connection
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/SocialDB`;
mongoose.connect(dbURL);

const db = mongoose.connection

db.on('open', function (){
    console.log("Connection Successful");
});

db.on('error', function (e){
    console.log("Error on Connection: " + e);
});

// Default Accounts
default_Accounts = [
    { username: "Admin", password: "theLeafs", pfp: "default.webp" },
    { username: "TestAccount1", password: "1234567", pfp: "rob.jpg" },
    { username: "TestAccount2", password: "ABCDEFG", pfp: "rob.jpg" },

    { username: "Rob", password: "rob123", pfp: "rob.jpg" },
    { username: "Lamar", password: "abdu", pfp: "lamar.png" },
    { username: "Thor", password: "thor123", pfp: "thor.jpg" },
    { username: "Nylander", password: "milad", pfp: "nylander.jpg" }
];

//Default Posts
default_Posts = [
    { user: "Admin", content: "First Post on Platform", date: Date.now(), userpfp: "default.webp" },
    { user: "TestAccount1", content: "Second Post on Platform", image: "default.webp", date: Date.now(), userpfp: "default.webp" },

    { user: "Rob", content: "Amazing Website", date: Date.now(), userpfp: "rob.jpg" },
    { user: "Lamar", content: "Lamar checking in!", date: Date.now(), userpfp: "lamar.png" },
    { user: "Thor", content: "Hello", date: Date.now(), userpfp: "thor.jpg" },
    { user: "Nylander", content: "William Nylander", image: "nylander.jpg", date: Date.now(), userpfp: "nylander.jpg" },

    { user: "Rob", content: "Lovely Weather we are having today", image: "default.webp", date: Date.now(), userpfp: "rob.jpg" },
    { user: "Lamar", content: "im so trash at football and will never win, im so sad", date: Date.now(), userpfp: "lamar.png" },
    { user: "Thor", content: "Dark mode UI goes hard", date: Date.now(), userpfp: "thor.jpg" },

    { user: "TestAccount2", content: "long long long long long long long text long text long text long text long text", date: Date.now(), userpfp: "default.webp" },
    { user: "Nylander", content: "Leafs 2027", date: Date.now(), userpfp: "nylander.jpg" },
];

//default Comments
default_Comments=[
    {user: "Admin", content: "First Comment"},
    {user: "TestAccount1", content: "Second Comment"}
];


// Adds Default Accounts to Database if not already added
async function addDefaultAccounts(){
    const userCount = await User.countDocuments();

    if (userCount === 0 ){
        default_Accounts.forEach(user => {
            const newUser = new User(user);
            newUser.save()
                .then(() => console.log("User added with username: " + user.username))
                .catch(err => console.error("Error has occured: " + err));
        });

    }else{
        console.log("Users already exist, not adding");
        return;
    }
};
addDefaultAccounts();


// Adds Default Posts to database if not already Added
async function addDefaultPosts(){
    const postCount = await Post.countDocuments();

    if (postCount === 0 ){
        default_Posts.forEach(post => {
            const newPost = new Post(post);
            newPost.save()
                .then(() => console.log("Post added with username: " + post.user))
                .catch(err => console.error("Error has occured: " + err));
        });

    }else{
        console.log("Posts already exist, not adding");
        return;
    }
};
addDefaultPosts();

// Adds Default Comments to database if not already Added
async function addDefaultComments(){
    const commentCount = await Comment.countDocuments();

    const postID = await Post.findOne();

    if (commentCount === 0 ){
        default_Comments.forEach(comment => {
            const addComment = {...comment, postId: postID._id}
            console.log(addComment)
            const newComment = new Comment(addComment);
            newComment.save()
                .then(() => console.log("Comment added with username: " + comment.user))
                .catch(err => console.error("Error has occured: " + err));
        });

    }else{
        console.log("Comments already exist, not adding");
        return;
    }
};
addDefaultComments();

//API

//Create user in database
app.post('/api/user', express.json(), async (req, res) => {
    const user = req.body;

    if (!user.username || !user.password){
        return res.status(400).json({error: "Username and password Required"});
    }

    const existing = await User.findOne({username: user.username.toLowerCase()});
    if(existing){
        return res.status(400).json({error: "Username Already Exists"});
    }

    const newUser = new User({
        username: user.username.toLowerCase(),
        password: user.password,
        pfp: "default.webp"
    });
    try {
        await newUser.save();
        console.log("User added successfully");
        return res.status(201).json(newUser);
    } catch (err) {
        console.error("Error adding user: " + err);
        return res.status(500).json({ error: "Failed to save user" });
    }
});

// Searches for user in database to login
app.get('/api/user/search', async (req, res) => {
    const userName = req.query.username.toLowerCase();
    const userPass = req.query.password;

    if (!userName || !userPass){
        return res.status(400).json({error: "All fields Required"});
    }

    try{
        const user = await User.findOne({username: userName, password: userPass});
        if (user){
            return res.status(200).json(user);
        }else{
            return res.status(404).json({error: "User not Found"});
        }
    }catch (error){
        return res.status(500).json({ error: "Failed to find user" });
    }
});

// Gets 10 random posts to show to user
app.get('/api/posts', async (req, res) => {
    const randomPosts = await Post.aggregate([
        { $sample: {size: 30}}
    ]);

    if (randomPosts.length === 0){
        return res.status(404).json({error: "No posts Found"});
    }

    return res.status(200).json(randomPosts);
});

app.get('/api/user/pfp/:username', async (req, res) => {
    try {
        const userName = req.params.username.toLowerCase();
        const user = await User.findOne({ username: userName }).select('pfp -_id');

        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});

//Gets all comments related to a post id
app.get('/api/comments', async (req, res) => {
    const id = req.query.postID;
    if (!id){
        return res.status(400).json({error: "Post ID Required"});
    }

    const comments = await Comment.find({postId: id});

    return res.status(200).json(comments);


});

// Adds new Comment to a Post
app.post('/api/comments', express.json(), async (req, res) => {
    const newComment = req.body;
    
    if (!newComment.postId || !newComment.user || !newComment.content){
        return res.status(400).json({error: "Bad request need all fields"});
    }
    console.log(newComment.user);
    const comment = new Comment(newComment);

    try {
        await comment.save();
        console.log("Comment added successfully");
        return res.status(201).json(comment);
    } catch (err) {
        console.error("Error adding comment: " + err);
        return res.status(500).json({ error: "Failed to save comment" });
    }

});

// Creates a post
app.post('/api/posts', upload.single('image'), async (req, res) => {
    const post = req.body;
    const image = req.file?.filename;
    console.log("Here");
    if (!post.content || !post.user || !post.date){
        return res.status(400).json({error: "Need content, user and date"});
    }

    const newPost = {
        user: post.user,
        content: post.content,
        date: post.date,
        userpfp: post.userpfp,
        image: req.file?.filename
    }

    const addPost = new Post(newPost);
    try {
            await addPost.save();
            console.log("Post added successfully");
            return res.status(201).json(addPost);
        } catch (err) {
            console.error("Error adding post: " + err);
            return res.status(500).json({ error: "Failed to save post" });
    
        }
});

// Finds a user based on username
app.get('/api/user', async (req, res) =>{
    const username = req.query.username.toLowerCase();

    if (!username){
        return res.status(400).json({error: "Need username"});
    }

    try{
        const user = await User.findOne({username: username});
        if (user){
            return res.status(200).json(user);
        }else{
            return res.status(404).json({error: "User not Found"});
        }
    }catch (error){
        return res.status(500).json({ error: "Failed to find user" });
    }

});

app.delete('/api/posts/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: "Post ID required" });
    }

    try {
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        const deletedComments = await Comment.deleteMany({ postId: id });

        return res.status(200).json({
            deletedPost,
            deletedComments: deletedComments.deletedCount
        }
    );

    } catch (error) {
        return res.status(500).json({ error: "Failed to delete post" });
    }
});

// Edit a post (text only)
app.patch('/api/posts/:id', express.json(), async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Post ID required" });
    }

    if (typeof content !== "string") {
        return res.status(400).json({ error: "Content required" });
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { content: content },
            { returnDocument: "after" }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(500).json({ error: "Failed to edit post" });
    }
});

app.listen(PORT, () => {console.log("Server started on port: " + PORT)});