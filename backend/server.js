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


// DEFAULT DATA 
default_Accounts = [
    { username: "admin", password: "theLeafs", pfp: "default.webp" },
    { username: "testAccount1", password: "1234567", pfp: "rob.jpg" },
    { username: "testAccount2", password: "ABCDEFG", pfp: "rob.jpg" },
    { username: "rob", password: "rob123", pfp: "rob.jpg" },
    { username: "lamar", password: "abdu", pfp: "lamar.png" },
    { username: "thor", password: "thor123", pfp: "thor.jpg" },
    { username: "nylander", password: "milad", pfp: "nylander.jpg" }
];

default_Posts = [
    { user: "admin", content: "First Post on Platform", date: Date.now(), userpfp: "default.webp" },
    { user: "testAccount1", content: "Second Post on Platform", image: "default.webp", date: Date.now(), userpfp: "default.webp" },
    { user: "rob", content: "Amazing Website", date: Date.now(), userpfp: "rob.jpg" },
    { user: "lamar", content: "Lamar checking in!", date: Date.now(), userpfp: "lamar.png" },
    { user: "thor", content: "Hello", date: Date.now(), userpfp: "thor.jpg" },
    { user: "nylander", content: "William Nylander", image: "nylander.jpg", date: Date.now(), userpfp: "nylander.jpg" },
    { user: "rob", content: "Lovely Weather we are having today", image: "default.webp", date: Date.now(), userpfp: "rob.jpg" },
    { user: "lamar", content: "im so trash at football and will never win, im so sad", date: Date.now(), userpfp: "lamar.png" },
    { user: "thor", content: "Dark mode UI goes hard", date: Date.now(), userpfp: "thor.jpg" },
    { user: "testAccount2", content: "long long long long long long long text long text long text long text long text", date: Date.now(), userpfp: "default.webp" },
    { user: "nylander", content: "Leafs 2027", date: Date.now(), userpfp: "nylander.jpg" },
];

default_Comments=[
    {user: "admin", content: "First Comment"},
    {user: "testAccount1", content: "Second Comment"}
];


// ADD DEFAULT DATA
async function addDefaultAccounts(){
    const userCount = await User.countDocuments();

    if (userCount === 0 ){
        default_Accounts.forEach(user => {
            const newUser = new User(user);
            newUser.save()
                .then(() => console.log("User added with username: " + user.username))
                .catch(err => console.error("Error has occured: " + err));
        });
    }
};
addDefaultAccounts();

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
    }
};
addDefaultPosts();

async function addDefaultComments(){
    const commentCount = await Comment.countDocuments();
    const postID = await Post.findOne();

    if (commentCount === 0 ){
        default_Comments.forEach(comment => {
            const addComment = {...comment, postId: postID._id}
            const newComment = new Comment(addComment);
            newComment.save();
        });
    }
};



// API ROUTES



// CREATE USER
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

    await newUser.save();

    return res.status(201).json(newUser);
});


// LOGIN SEARCH USER
app.get('/api/user/search', async (req, res) => {

    const userName = req.query.username.toLowerCase();
    const userPass = req.query.password;

    const user = await User.findOne({username: userName, password: userPass});

    if (user){
        return res.status(200).json(user);
    }

    return res.status(404).json({error: "User not Found"});
});


 
//  SEARCH ROUTES


app.get('/api/posts', async (req, res) => {

    const search = req.query.search || "";
    const sort = req.query.sort === "oldest" ? 1 : -1;

    try {

        let posts;

        if(search === ""){
            posts = await Post.aggregate([{ $sample: { size: 30 } }]);
        }
        else{
            posts = await Post.find({
                $or:[
                    {content: {$regex: search, $options:"i"}},
                    {user: {$regex: search, $options:"i"}}
                ]
            }).sort({date: sort});
        }

        return res.status(200).json(posts);

    }
    catch(err){
        console.error(err);
        return res.status(500).json({error:"Failed to fetch posts"});
    }

});


// GET COMMENTS
app.get('/api/comments', async (req, res) => {

    const id = req.query.postID;

    const comments = await Comment.find({postId: id});

    return res.status(200).json(comments);

});


// CREATE POST
app.post('/api/posts', upload.single('image'), async (req, res) => {

    const post = req.body;
    const image = req.file?.filename;

    const newPost = new Post({
        user: post.user.toLowerCase(),
        content: post.content,
        date: post.date,
        userpfp: post.userpfp,
        image: image
    });

    await newPost.save();

    return res.status(201).json(newPost);

});


// DELETE POST
app.delete('/api/posts/:id', async (req, res) => {

    const id = req.params.id;

    const deletedPost = await Post.findByIdAndDelete(id);
    await Comment.deleteMany({postId:id});

    return res.status(200).json(deletedPost);

});


// EDIT POST
app.patch('/api/posts/:id', express.json(), async (req, res) => {

    const id = req.params.id;
    const {content} = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        {content:content},
        {returnDocument:"after"}
    );

    return res.status(200).json(updatedPost);

});


app.listen(PORT, () => {console.log("Server started on port: " + PORT)});