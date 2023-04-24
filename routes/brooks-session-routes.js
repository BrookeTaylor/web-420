/*
============================================
; Title: brooks-user.js
; Author: Professor Krasso 
; Date: 04/23/2023
; Modified By: Brooks
; Description: User sign up and log in.
============================================
*/ 

// Add the appropriate requirement statements 
// (express, router, User, and bcrypt)
const express = require('express');
const User = require('../models/brooks-user');
const bcrypt = require('bcryptjs');

// Create a variable named router and assign it the express.Router() function. 
const router = express.Router();


// Add a variable named saltRounds with an integer value of 10
const saltRounds = 10;


/**
 * 
 * signup
 * @openapi 
 * /api/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new sign on. 
 *     description: Sign up API. 
 *     requestBody:
 *       description: Create user. 
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *               - emailAddress
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               emailAddress: 
 *                 type: string     
 *     responses: 
 *       '200':
 *         description: Registered user. 
 *       '401':
 *         description: Username is already in use. 
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 * 
 */

router.post('/signup', async (req, res) => {

    try {

        const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
        const newRegisteredUser = {
            userName: req.body.userName,
            password: hashedPassword,
            emailAddress: req.body.emailAddress,
        }

        await User.create(newRegisteredUser, function(err, password) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                })
            } else {
                console.log(password);
                res.json(password);
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        });
    }
});



/**
 * 
 * login
 * @openapi 
 * /api/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Lets users log in. 
 *     description: Log in API. 
 *     requestBody:
 *       description: User log in. 
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string 
 *     responses: 
 *       '200':
 *         description: User logged in. 
 *       '401':
 *         description: Invalid username and/or password. 
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 * 
 */

router.post('/login', async (req, res) => {

    try {
        User.findOne({ 'userName': req.body.userName },
        function (err, user) {

            if (err) {
                console.log(err);
                res.status(501).send({
                    'message': `MongoDB Exception: ${err}`
                });
            } else {
                if (user) {
                    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

                    if (passwordIsValid) {
                        res.status(200).send({
                            'message': 'User logged in'
                        });
                    } else {
                        res.status(401).send({
                            'message': `Invalid username and/or password`
                        });
                    }
                } else {
                    res.status(401).send({
                        'message': `Invalid username and/or password`
                    });
                }
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            'message': `Server Exception: ${e.message}`
        });
    }
});

module.exports = router;

