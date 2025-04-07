/**
 * Title: brooks-person-routes.js
 * Instructor: Professor Krasso
 * Author: Brooke Taylor
 * Date 4/14/23
 * Revision: 4/7/25
 * Description: Person Routes.
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
 *         description: 'Ok: The request was successful.' 
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.' 
 */

router.get('/persons', async (req, res) => {

    try {

//        throw new Error("Simulated 500 Error Test");       // THIS LINE WAS USED FOR TESTING 500 CALL
        const person = await Person.find({});

        console.log(`200 Ok: The request was successful.\nFound ${person.length} persons.`);
        return res.status(200).json(person);

    } catch (err) {
        console.error(err);
        console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
        return res.status(500).json({ message: '500 Internal Server Error: A server error occurred.' });
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
 *       '201':
 *         description: 'Created: A new resource has been successfully created.'
 *       '400':
 *         description: 'Bad Request: The request was malformed or invalid.'  
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */

router.post('/persons', async (req, res) => {
    try {
      const { firstName, lastName, roles, dependents, birthDate } = req.body;
  
      if (!firstName || !lastName || !Array.isArray(roles) || !Array.isArray(dependents) || !birthDate) {
        console.warn(`400 Bad Request: The request was malformed or invalid`)
        return res.status(400).json({
          message: 'Bad Request: The request was malformed or invalid.',
        });
      }
  
      const newPerson = { firstName, lastName, roles, dependents, birthDate };
  
      const person = await Person.create(newPerson);
      console.log(person);
      res.status(201).json(person);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `Server Exception: ${err.message}`,
      });
    }
  });
  


// Export the router using module.exports. 
module.exports = router;

