const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const router = express.Router();

// @TODO: Assignment here

router.post('/signin', async (req, res) => {
  // recived body will be = {"username":"ahm","password":"12345678","rememberMe":"on"}
  // const Users = await User.find();
  // res.status(201).json(Users);
  // res.status(201).json(req.body);
  try {
    const { username, password, rememberMe } = req.body; 
    const user = await User.findOne({ username }); 
    if (!user) {
      return res
        .status(400)
        .render('user/signin', { error: 'Wrong username or password' });
    } 
    const passwordMatch = await bcrypt.compare(password, user.password_hash); 
    if (!passwordMatch) {
      return res
        .status(400)
        .render('user/signin', { error: 'Wrong username or password' });
    } 
    res.set('user', user._id);  
    res.redirect('/user/authenticated');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      username,
      password,
      password2,
      acceptTos,
      avatar,
    } = req.body;
    if (password !== password2) {
      return res.status(400).send("Passwords do not match");
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already used' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      firstname,
      lastname,
      username,
      password_hash: hashedPassword,
      acceptTos,
      avatar,
    });
    res.redirect('/user/authenticated');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/signout', (req, res) => {
  // @TODO: Complete user sign out
});

// renders sign up page
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

// renders sign in page
router.get('/signin', (req, res) => {
  res.render('user/signin');
});

router.get('/authenticated', (req, res) => {
  res.render('user/authenticated');
});

module.exports = router;
