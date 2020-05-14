const express = require('express');
const registerRouter = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/users');




registerRouter.post('/', async (req,res,next) => {
    let newUser = req.body;
    await User.findOne({email: newUser.email}, async (err,response) => {
        if(err){
            return next(err);
        }else{
            if(response){
                res.status(304).send('email already taken')
            }else{
                const hashedPwd = await bcrypt.hash(newUser.password, 10);
                newUser.password = hashedPwd;
                newUser.email = newUser.email.toLowerCase();
                await User(newUser).save((err, response) => {
                    if(err){
                    return next(err);
                    }else{
                    res.status(201).json({user: response});
                    }
                })
            }
        }
    })    
})

module.exports = registerRouter;