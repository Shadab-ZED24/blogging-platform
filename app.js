const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Post = require('./models/Post');
require('dotenv').config();
var bcrypt = require('bcryptjs');
const User = require('./models/User');
const moment = require('moment');

const app = express();

app.use(bodyParser.json());

// MongoDB connection

connection = () => {

    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));


}
const checkAuth = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        await connection();
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        console.log('log1')
        if (!token) {
            const error = new Error('Authentication failed!');
            console.log('log2')

            return next(error);
        }


        console.log('log3')

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.aggregate([{ $match: { username: decodedToken.username } }]);
        user = user[0];

        console.log('log4')


        if (token !== user.token) {
            console.log(token, "abcd", user.token)
            const error = new Error('Authentication failed!');
            return next(error);
        }

        if (user.role !== decodedToken.role) {
            const error = new Error('Authentication failed!',);
            return next(error);
        }

        console.log('log6')


        req.userData = { uid: decodedToken.username, role: decodedToken.role };

        console.log('log7')

        next();
    } catch (err) {
        const error = new Error('Authentication failed!');
        return next(error);
    }
}


// Routes
app.get('/posts', checkAuth, async (req, res) => {
    try {
        await connection();
        const posts = await Post.find();
        return res.json({ status: true, data: posts })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/addPost', checkAuth, async (req, res) => {
    try {
        await connection();

        console.log(req.userData)

        const role = req.userData.role;
        const { title, content } = req.body;
        const author = req.userData.uid;
        const creationDate = moment(new Date()).format("YYYY-MM-DD");
        if (role === "Read") {
            return res.json({ status: false, error: "User doesn't have access to post anything!" });
        }


        let lastPost = await Post.aggregate([{
            $sort: {
                _id: -1
            },

        }, { $limit: 1 }]);


        const newPost = new Post({
            title, content, author, creationDate, pid: lastPost.length ? lastPost[0].pid + 1 : 1
        });

        let created = false;

        await newPost.save()
            .then((result) => {
                created = true;
                console.log(result)

            })
            .catch((error) => {
                console.error("Error saving record:", error);
                created = false;
            });

        console.log(created)


        if (created) {
            return res.json({ status: true, message: "Post created successfully" });
        }
        else {
            return res.json({ status: false, message: "Post creation failed!" })
        }



    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/retrieveById/:id', checkAuth, async (req, res) => {
    try {
        await connection();
        const pid = req.params.id;
        const post = await Post.findOne({ pid: Number(pid) });
        return res.json({ status: true, data: post })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/removeById/:id', checkAuth, async (req, res) => {
    try {
        await connection();
        if (role === "Read") return res.json({ status: false, error: "User doesn't have access to delete a post" });

        const pid = req.params.id;
        const deletedPost = await Post.deleteOne({ pid: Number(pid) });

        if (deletedPost.deletedCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.json({ status: true, message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/updateById/:id', checkAuth, async (req, res) => {
    try {
        await connection();

        const role = req.userData.role;
        if (role === "Read") return res.json({ status: false, error: "User doesn't have access to update a POST" });
        const pid = req.params.id;
        const update = req.body; // Assuming req.body contains the fields to be updated
        const updatedPost = await Post.findOneAndUpdate({ pid: Number(pid) }, update, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.json({ status: true, data: updatedPost, message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/filterPosts', checkAuth, async (req, res) => {
    try {
        await connection();

        const type = req.body.type;

        if (type === 'author') {
            const author = req.body.author;
            const posts = await Post.find({ author: author });
            return res.json({ status: true, data: posts });
        } else if (type === 'creationDate') {

            const createdDate = req.body.creationDate;

            const posts = await Post.find({ creationDate: createdDate });
            return res.json({ status: true, data: posts });
        } else {
            return res.status(400).json({ message: 'Invalid filter type' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/postsPagination', checkAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
        const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not specified
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .skip(skip)
            .limit(limit);


        return res.json({ status: true, data: posts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Define other routes for GET /posts/:id, POST /posts, PUT /posts/:id, DELETE /posts/:id

// Authentication middleware
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = decoded;
        next();
    });
}

// Generate token for authentication
function generateToken(user) {
    return jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// User authentication
app.post('/login', async (req, res) => {
    try {

        await connection();
        const { username, password } = req.body;
        let validUser, getUser;

        console.log("log1")

        const user = await User.aggregate([{ $match: { username: username } }]);
        (await bcrypt.compare(password, user[0].password)) ? (validUser = true) : (validUser = fasle);

        console.log("log2")


        if (!validUser) {
            return res.json({ status: false, message: "Invalid credentials" });
        }

        console.log("log3")


        let token;

        token = jwt.sign(
            { username: username, role: user[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "6h" }
        )

        console.log("log4")


        await User.findOne({ username: username })
            .then(user => {
                if (!user) {
                    console.log("User not found");
                    return;
                }

                // Update the user's email address
                user.token = token;

                // Save the updated user object
                return user.save();
            })
            .then(updatedUser => {
                console.log("User updated successfully:", updatedUser);
            })
            .catch(error => {
                console.error("Error updating user:", error);
            });

        console.log("log6")


        return res.json({ status: true, token: token })

    } catch (error) {

        console.log(error);
        return res.json({ status: false, message: "User login failed!" })

    }

    // Authenticate user against database
    // If authenticated, generate token
    // Return token in response
});

app.post('/addUser', async (req, res) => {
    await connection();
    try {


        const { username, password, role } = req.body;
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password.toString(), salt);

        const newUser = new User({
            username,
            password: hash,
            role: role,
        });

        let created = false;

        await newUser.save()
            .then((result) => {
                created = true;
                console.log(result)

            })
            .catch((error) => {
                console.error("Error saving record:", error);
                created = false;
            });

        console.log(created)


        if (created) {
            return res.json({ status: true, message: "User created successfully" });
        }
        else {
            return res.json({ status: false, message: "User creation failed!" })
        }




    } catch (error) {
        console.log(error)
        return res.json({
            status: false,
            error: "Error while creating the user!"
        })
    }



})

// Middleware to check user role
function authorize(role) {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
        next();
    };
}

app.listen(3000, () => console.log('Server started on port 3000'));