/*
============================================
; Title: brooks-person-routes.js
; Author: Professor Krasso 
; Date: 04/14/2023
; Modified By: Brooks
; Description: Composer API Routes.
============================================
*/ 

// Add the appropriate requirement statements 
// (express, router, and Person).
const express = require('express');


// Create a variable named router and assign it 
// the express.Router() function. 
const router = express.Router();

const Person = require('../models/brooks-person');


/**
 * 
 * findAllPersons
 * @openapi
 * /api/persons:
 *   get:
 *     tags:
 *       - Persons
 *     summary: Returns a list of Persons.
 *     description: API for returning a list Persons
 *     responses:
 *       '200':
 *         description: Array of person documents. 
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception
 * 
 */
router.get('/persons', async(req, res) => {

// Wrap the code in a try/catch block.
    try {
    
// Query the people collection using the find() function on 
// the Person model.
        Person.find({}, function(err, persons) {
    
// Either return an array of person documents or the 
// appropriate message depending on the status code.
            if (err) {
                console.log(err);
                res.status(501).send({
                    message: `MongoDB Exception: ${err}`
                });
                } else {
                    console.log(persons);
                    res.json(persons);
                }
            });
        } catch(e) {
            console.log(e);
            res.status(500).send({
                message: `Server Exception: ${e.message}`
            });
    }
    
});


/**
 * 
 * createPerson
 * @openapi
 * /api/persons:
 *   post:
 *     tags:
 *       - Persons
 *     summary: Creates a new person object.
 *     description: API for adding new person object.
 *     requestBody:
 *       description: Person's information
 *       content:
 *         application/json:
 *           schema:
 *             required: 
 *               - firstName
 *               - lastName
 *               - roles
 *               - dependents
 *               - birthDate
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *               dependents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *               birthDate:
 *                     type: string
 *     responses:
 *       '200':
 *         description: Array of person documents. 
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception
 * 
 */

router.post('/persons', async(req, res) => {

// Wrap the code in a try/catch block.
    try {

// Query the people collection using the find() function on 
// the Person model.
        const newPerson = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            roles: req.body.roles,
            dependents: req.body.dependents,
            birthDate: req.body.birthDate
        }

        await Person.create(newPerson, function(err, person) {

// Either return an array of person documents or the 
// appropriate message depending on the status code.
            if (err) {
                console.log(err);
                res.status(501).send({
                    message: `MongoDB Exception: ${err}`,
                });
            } else {
                console.log(person); 
                res.json(person);
            }
        });
    } catch(e) {
        console.log(e); 
        res.status(500).send({
            message: `Server Exception: ${e.message}`,
        });
    }
});

// Export the router using module.exports. 
module.exports = router;

