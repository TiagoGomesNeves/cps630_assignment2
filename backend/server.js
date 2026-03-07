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
    { username: "admin", password: "theLeafs", pfp: "default.webp" },
    { username: "abdu", password: "123", pfp: "rob.jpg" },
    { username: "tiago", password: "123", pfp: "rob.jpg" },
    { username: "milad", password: "123", pfp: "rob.jpg" },
    { username: "taha", password: "123", pfp: "rob.jpg" },
    { username: "rob", password: "rob123", pfp: "rob.jpg" },
    { username: "lamar", password: "abdu", pfp: "lamar.png" },
    { username: "thor", password: "thor123", pfp: "thor.jpg" },
    { username: "nylander", password: "milad", pfp: "nyla`nder.jpg" }
];

//Default Posts
default_Posts = [
    { user: "admin", content: "Welcome to the new platform! Glad to have everyone here.", image: "welcome.jpg", date: new Date('2024-01-15'), userpfp: "rob.jpg" },
    { user: "abdu", content: "Just finished setting up my profile. The dark mode looks sick!", date: new Date('2026-03-01'), userpfp: "rob.jpg" },
    { user: "nylander", content: "Game day! Let's get that W tonight!", image: "leafs.webp", date: Date.now(), userpfp: "nylander.jpg" },
    { user: "lamar", content: "Yo it's Lamar Jackson, Checking in!", date: Date.now(), userpfp: "lamar.png" },
    { user: "rob", content: "Anyone watching the Wild game? That last goal was insane.", image: "default.webp", date: Date.now(), userpfp: "rob.jpg" },
    { user: "tiago", content: "Testing the image upload feature... Seems to be working perfectly!", image: "toronto.jpg", date: Date.now(), userpfp: "rob.jpg" },
    { user: "milad", content: "Working on the new Search algorithm today. Stay tuned.", date: new Date('2026-03-04'), userpfp: "rob.jpg" },
    { user: "thor", content: "Dark mode UI goes hard. Best CSS I've seen in a while.", date: new Date('2026-03-05'), userpfp: "thor.jpg" },
    { user: "taha", content: "Does anyone know how to fix a 404 error on the profile page?", image: "error.webp", date: Date.now(), userpfp: "rob.jpg" },
    { user: "nylander", content: "Leafs 2027 is the year. I'm calling it now.", date: Date.now(), userpfp: "nylander.jpg" },
    { user: "admin", content: "This site is currently in beta mode.", date: Date.now(), userpfp: "default.webp" }
];

//default Comments
default_Comments=[
    {user: "admin", content: "First Comment"},
    {user: "abdu", content: "Second Comment"}
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
        for (const post of default_Posts){
            const newPost = new Post(post);
            await newPost.save()
                .then(() => console.log("Post added with username: " + post.user))
                .catch(err => console.error("Error has occured: " + err));
        }
        await addDefaultComments();

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

    console.log(userName);
    console.log(userPass);

    try{
        const user = await User.findOne({username: userName, password: userPass});
        console.log(user);
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

// Gets a profile picture for a user
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
        user: post.user.toLowerCase(),
        content: post.content,
        date: post.date,
        userpfp: post.userpfp,
        image: image
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
        console.log(user);
        if (user){
            return res.status(200).json(user);
        }else{
            return res.status(404).json({error: "User not Found"});
        }
    }catch (error){
        return res.status(500).json({ error: "Failed to find user" });
    }

});

// Deletes a post and all comments related to that post
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

// Search for posts by a specific user
app.get('/api/posts/search', async (req,res) =>{
    const user = req.query.username.toLowerCase();

    

    if (!user){
        return res.status(400).json({error: "Username needed"});
    }

    try{
         const posts = await Post.find({user: user});
         console.log(posts);
         return res.status(200).json(posts);
    }catch (error){
        return res.status(500).json({error: error});
    }

    
});

// Edit a profile picture
app.patch('/api/pfp', upload.single("image"), async (req, res) => {
    const user = req.body.user;
    const image = req.file?.filename;

    const pfp = image;

    if (!user || !image){
        return res.status(400).json({error: "Invalid Data"});
    }
    console.log("Here");
    console.log(user);
    try{
        const updatedUser = await User.findOneAndUpdate(
            {username: user},
            {$set: {pfp: pfp}},
            {returnDocument: 'after'}
        )
        const updatedPost = await Post.updateMany(
            {user: user},
            {$set: {userpfp: pfp}}
        )
        console.log(updatedUser);
        console.log(updatedPost);

        if (updatedUser){
            return res.status(200).json(updatedUser)
        }else{
            return res.status(404).json({error: "User not found"});
        }
    }catch(error){
        return res.status(500).json({error: error});
    }
});

// Edit a password
app.patch('/api/password/:username', express.json(), async (req, res) => {
    const username = req.params.username;
    const pass = req.body;

    if(!username || !pass.password){
        return res.status(400).json({error: "Invalid Data"});
    }

    try{
        const user = await User.findOneAndUpdate(
            {username: username},
            {$set: {password: pass.password}},
            {returnDocument: 'after'}
        )

        if (user){
            return res.status(200).json(user);
        }else{
            return res.status(404).json({error: "User not found"});
        }
    }catch(error){
        return res.status(500).json({error: error});
    }
});

// Edit a username and update all posts and comments
app.patch('/api/username/:username', express.json(), async (req, res) => {
    const username = req.params.username;
    const user = req.body;


    if(!username || !user.username){
        return res.status(400).json({error: "Invalid Data"});
    }

    try{
        const newUser = await User.findOneAndUpdate(
            {username: username},
            {$set: {username: user.username.toLowerCase()}},
            {returnDocument: 'after'}
        )

        const newPosts = await Post.updateMany(
            {user: username},
            {$set: {user: user.username.toLowerCase()}}
        )

        const newComments = await Comment.updateMany(
            {user: username},
            {$set: {user: user.username.toLowerCase()}}
        )
       
        if (newUser){
            return res.status(200).json(newUser);
        }else{
            return res.status(404).json({error: "User not found"});
        }
    }catch(error){
        return res.status(500).json({error: error});
    }
});

// Deletes a user and all posts and comments
app.delete('/api/user/:username',  async (req, res) => {
    const username = req.params.username;
    try{
        const user = await User.findOne({username: username});
        if (!user){
            return res.status(404).json({error: "User Not Found"});
        }else{
            await User.deleteOne({username: username});
            await Post.deleteMany({user: username});
            return res.status(204).send();
        }
    }catch(error){
        return res.status(500).json({error: error});
    }
});

// Search for posts with a keyword and sort by date
app.get('/api/posts/sortedsearch', async (req, res) => {
    const { search, sort } = req.query;
    try {
        const query = search ? { content: { $regex: search, $options: 'i' } }  : {};
        
        const sortOption = sort === 'oldest' ? { date: 1 } : { date: -1 };

        const posts = await Post.find(query).sort(sortOption);
        console.log(posts);
        if (posts.length === 0) {   
            return res.status(404).json({ error: "No posts found" });
        }
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: "Failed to search posts" });
    }
});
app.listen(PORT, () => {console.log("Server started on port: " + PORT)});