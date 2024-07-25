const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


router.post('/register', async (req, res) => {
    console.log("register called");
    const {username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username, password: hashedPassword});
    await newUser.save();
    res.json({success: true});
});

router.post('/login', async (req, res) => {
    console.log("login called");

    const {username, password } = req.body;
    const user = await User.findOne({username})
    if(user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        console.log("login success");
        res.json({success: true, token});
    } else {
        res.json({success: false});
    }
});

module.exports = router;


