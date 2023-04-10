/*
============================================
; Title: brooks-composer-routes.js
; Author: Professor Krasso 
; Date: 04/08/2023
; Modified By: Brooks
; Description: Composer API Routes.
============================================
*/ 


// Add the appropriate requirement statements 
// (express, router, Composer)
const express = require('express');
const Composer = require('../models/brooks-composer');


// Create a variable named router and assign it 
// the express.Router() function. 
const router = express.Router();


// Describe the operation using the OpenAPI Specification above 
// the request as developer comments.
/**
 * 
 * findAllComposers
 * 
 * 
 * @openapi 
 * 
 * /api/composers:
 * 
 *   get:
 * 
 *     tags:
 * 
 *       - Composers
 * 
 *     summary: Returns a list of all composer documents
 *     
 *     description: API for returning a list of composers from 
 *       MongoDB Atlas
 * 
 *     responses: 
 *     
 *       '200':
 *         description: Array of composer documents
 * 
 *       '500':
 *         description: Server Exception
 * 
 *       '501':
 *         description: MongoDB Exception
 * 
 * 
 */

router.get('/composers', async(req, res) => {

// Wrap the code in a try/catch block.
    try {

// Query the composers collection using the find() function from the Composer model.
        Composer.find({}, function(err, composers) {

// Either return an array of composer documents or the 
// appropriate message depending on the status code.
            if (err) {
                console.log(err);
                res.status(501).send({
                    message: `MongoDB Exception: ${err}`
                });
            } else {
                console.log(composers);
                res.json(composers);
            }
        });
    } catch(e) {
        console.log(e);
        res.status(500).send({
            message: `Server Exception: ${e.message}`
        });
    }

});



// Describe the operation using the OpenAPI Specification above 
// the request as developer comments.
/**
 * 
 * findComposerById
 * 
 * 
 * @openapi 
 * 
 * /api/composers/{id}:
 * 
 *   get:
 * 
 *     tags:
 * 
 *       - Composers
 * 
 *     summary: Returns a composer document.
 *     
 *     description: API for returning a single composer object 
 *       from MongoDB
 * 
 *     parameters:
 * 
 *     - name: id
 * 
 *       in: path
 * 
 *       description: The composerId requested by the user
 * 
 *       schema: 
 * 
 *         type: string
 * 
 *       required: true 
 * 
 *     responses: 
 *     
 *       '200':
 *         description: Composer document
 * 
 *       '500':
 *         description: Server Exception
 * 
 *       '501':
 *         description: MongoDB Exception
 * 
 * 
 */

router.get('composers/:id', async(req, res) => {

// Wrap the code in a try/catch block.    
    try {

// Query the composers collection using the findOne() function 
// and the RequestParms id on the Composer model.        
        Composer.findOne({ _id: req.params.id }, function(err, composer) {

// Either return the found composer document or 
// the appropriate message depending on the status code.            
            if (err) {
                console.log(err);
                res.status(500).send({
                    message: `MongoDB Exception: ${err}`,
                });
            } else {
                console.log(composer);
                res.json(composer);
            }
        });
    } catch(e) {
        console.log(e);
        res.status(500).send({
            message: `Server Exception: ${e.message}`,
        });
    }

});



// Describe the operation using the OpenAPI Specification above 
// the request as developer comments.
/**
 * 
 * createComposer
 * 
 * 
 * @openapi 
 * 
 * /api/composers:
 * 
 *   post:
 * 
 *     tags:
 * 
 *       - Composers
 * 
 *     summary: Creates a new composer object.
 * 
 *     description: API for adding new composer objects.
 * 
 *     requestBody:
 * 
 *       description: Composer's information
 * 
 *       content:
 * 
 *         application/json:
 * 
 *           schema:
 * 
 *         type: object
 * 
 *         properties:
 * 
 *           firstName:
 * 
 *             type: string
 * 
 *           lastName:
 * 
 *             type: string
 * 
 *     responses: 
 *     
 *       '200':
 *         description: Composer document
 * 
 *       '500':
 *         description: Server Exception
 * 
 *       '501':
 *         description: MongoDB Exception
 * 
 * 
 */

router.post('/composers', async(req, res) => {
    try {
        const newComposer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }

        await Composer.create(newComposer, function(err, composer) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    message: `MongoDB Exception: ${err}`,
                });
            } else {
                console.log(composer); 
                res.json(composer);
            }
        });
    } catch(e) {
        console.log(e); 
        res.status(500).send({
            message: `Server Exception: ${e.message}`,
        });
    }
});

