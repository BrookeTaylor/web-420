/**
 * Title: brooks-session-routes.js
 * Instructor: Professor Krasso
 * Author: Brooke Taylor
 * Date 4/23/23
 * Revision: 4/7/25
 * Description: User sign up and log in.
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
 *       '201':
 *         description: 'Created: A new resource has been successfully created.' 
 *       '400':
 *         description: 'Bad Request: The request was malformed or invalid.' 
 *       '409':
 *         description: 'Conflict: The request could not be completed due to a conflict'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 * 
 */

router.post('/signup', async (req, res) => {
    try {
        const { userName, password, emailAddress } = req.body;

        if (!userName || !password || !emailAddress) {
            console.warn(`400 Bad Request: The request was malformed or invalid.\nuserName=${userName} password=${password} emailAddress=${emailAddress}`);
            return res.status(400).send({
                message: '400 Bad Request: The request was malformed or invalid.'
            });
        }

        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const newRegisteredUser = {
            userName,
            password: hashedPassword,
            emailAddress,
        };

        const existingUser = await User.findOne({ userName: userName });
        if (existingUser) {
            console.warn(`409 - Conflict: The request could not be completed due to a conflict.\nuserName=${userName}`);
            return res.status(409).send({
                message: `409 Conflict: The request could not be completed due to a conflict.`
            });
        }

        const createdUser = await User.create(newRegisteredUser);
        console.log(`201 - Created: New user "${userName}" successfully registered.`);
        res.status(201).json(createdUser);

    } catch (e) {
        console.error(`500 - Server Exception: ${e.message}`);
        res.status(500).send({
            message: `Server Exception: ${e.message}`
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
 *         description: 'Ok: The request was successful.' 
 *       '400':
 *         description: 'Bad Request: The request was malformed or invalid.'
 *       '401':
 *         description: 'Unauthorized: Authentication is required and has failed or not been provided.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 * 
 */

router.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            console.warn('400 Bad Request: The request was malformed or invalid.\nuserName=${userName} password=${password}');
            return res.status(400).send({
                message: 'Bad Request: The request was malformed or invalid.'
            });
        }

        const user = await User.findOne({ userName });

        if (!user) {
            console.warn(`401 Unauthorized: Authentication is required and has failed or not been provided.\n${userName} is not registered.`);
            return res.status(401).send({
                message: '401 Unauthorized: Authentication is required and has failed or not been provided. Not registered.'
            });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            console.warn(`401 Unauthorized: Authentication is required and has failed or not been provided.\nIncorrect Password for ${userName}.`);
            return res.status(401).send({
                message: '401 Unauthorized: Authentication is required and has failed or not been provided. Incorrect password.'
            });
        }

        console.log(`200 Ok: The request was successful.\n${userName} has logged in.`);
        res.status(200).send({
            message: '200 Ok: The request was successful.'
        });

    } catch (e) {
        console.error(`500 Internal Server Error: A server error occurred.\n${e.message}`);
        res.status(500).send({
            message: `Internal Server Error: A server error occurred.`
        });
    }
});


module.exports = router;

