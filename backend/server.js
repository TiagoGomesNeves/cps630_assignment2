const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');

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
        password: user.password
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


app.get('/api/user/search', async (req, res) => {
    const userName = req.query.username.toLowerCase();
    const userPass = req.query.password;

    if (!userName || !userPass){
        return res.status(400).json({error: "All fields Required"});
    }

    try{
        const user = await User.findOne({username: userName, password: userPass});
        if (user){
            console.log("User Found");
            return res.status(200).json(user);
        }else{
            return res.status(401).json({error: "User not Found"});
        }
    }catch (error){
        return res.status(500).json({ error: "Failed to find user" });
    }
});



app.listen(PORT, () => {console.log("Server started on port: " + PORT)});