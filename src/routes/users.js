const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

//GET
router.get('/users/signin', (req, res) => { 
    res.render('users/signin');
});

router.get('/users/signup', (req, res) => { 
    res.render('users/signup');
}); 

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

//POST
router.post('/users/signup', async (req,res) => {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    if(name.length < 3){
        errors.push({text: 'Name must be at least 3 characters'});
    }

    if(password != confirm_password){
        errors.push({text: 'Password do not match'});
    }

    if(password.length < 4){
        errors.push({text: 'Password must be at least 4 caracters'});
    }

    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else{
        
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            console.log(emailUser);

            req.flash('error_msg', 'Email already in use');
            res.redirect('/users/signup');
        }
        
        const newUser = new User({name, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'You are registered');
        res.redirect('/users/signin');
    }
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

module.exports = router;