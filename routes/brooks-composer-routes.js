/**
 * Title: brooks-composer-routes.js
 * Instructor: Professor Krasso
 * Author: Brooke Taylor
 * Date 4/8/23
 * Revision: 4/4/25
 * Description: Composer API Routes.
 */


// Add the appropriate requirement statements 
// (express, router, Composer)
const express = require('express');
const Composer = require('../models/brooks-composer');


// Create a variable named router and assign it 
// the express.Router() function. 
const router = express.Router();


/**
 * findAllComposers
 * @openapi
 * /api/composers:
 *   get:
 *     tags:
 *       - Composers
 *     summary: Returns a list of all composer documents
 *     responses:
 *       '200':
 *         description: 'Ok: The request was successful.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */

router.get('/composers', async (req, res) => {

    try {

//        throw new Error("Simulated 500 Error Test");       // THIS LINE WAS USED FOR TESTING 500 CALL
        const composers = await Composer.find({});

        console.log(`200 Ok: The request was successful.\nFound ${composers.length} composers.`);
        return res.status(200).json(composers);

    } catch (err) {
        console.error(err);
        console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
        return res.status(500).json({ message: '500 Internal Server Error: A server error occurred.' });
    }
});
  




/**
 * findComposerById
 * @openapi
 * /api/composers/{id}:
 *   get:
 *     tags:
 *       - Composers
 *     summary: Retrieve a composer by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the composer
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 'Ok: The request was successful.'
 *       '400':
 *         description: 'Bad Request: The request was malformed or invalid.'
 *       '404':
 *         description: 'Not Found: The requested resource could not be found.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */

router.get('/composers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.warn(`400 Bad Request: The request was malformed or invalid\n${id}`);
            return res.status(400).json({ message: '400 Bad Request: The request was malformed or invalid.' });
        }

//        throw new Error("Simulated 500 Error Test");       // THIS LINE WAS USED FOR TESTING 500 CALL
        const composer = await Composer.findById(id);

        if (!composer) {
            console.warn(`404 Not Found: The requested resource could not be found.\n${id}`);
            return res.status(404).json({ message: '404 Not Found: The requested resource could not be found.' });
        }

        console.log(`200 Ok: The request was successful.\n${composer.firstName} ${composer.lastName}.`);
        return res.status(200).json(composer);

    } catch (err) {
        console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
        return res.status(500).json({ message: '500 Internal Server Error: A server error occurred.' });
    }
});







/**
 * createComposer
 * @openapi
 * /api/composers:
 *   post:
 *     tags:
 *       - Composers
 *     summary: Create a new composer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The firstName of the composer
 *               lastName:
 *                 type: string
 *                 description: The lastName of the composer
 *     responses:
 *       '201':
 *         description: 'Created: A new resource has been successfully created.'
 *       '400':
 *         description: 'Bad Request: The request was malformed or invalid.'
 *       '409':
 *         description: 'Conflict: The request could not be completed due to a conflict.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */

router.post('/composers', async (req, res) => {
    try {
        const { firstName, lastName } = req.body; 

//        throw new Error('Simulated 500 Error Test');       // THIS LINE WAS USED FOR TESTING 500 CALL

        if (!firstName || !lastName) {
            console.warn(`400 Bad Request: The request was malformed or invalid.\nfirstName=${firstName} lastName=${lastName}`);
            return res.status(400).json({ message: '400 Bad Request: The request was malformed or invalid.' });
        }

        const existingComposer = await Composer.findOne({ firstName, lastName });

        if (existingComposer) {
            console.warn(`409 Conflict: The request could not be completed due to a conflict\n${firstName} ${lastName}`);
            return res.status(409).json({ message: '409 Conflict: The request could not be completed due to a conflict.' });
        }

        const newComposer = new Composer({ firstName, lastName });
        const savedComposer = await newComposer.save();

        console.log(`201 Created: A new resource has been successfully created.\n${savedComposer.firstName} ${savedComposer.lastName}`);
        return res.status(201).json(savedComposer); 

    } catch (err) {
        console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
        return res.status(500).json({ message: '500 Internal Server Error: A server error occurred.' });
    }
});






/**
 * updateComposerById
 * @openapi
 * /api/composers/{id}:
 *   put:
 *     tags:
 *       - Composers
 *     summary: Update an existing composer by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the composer to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The updated first name of the composer
 *               lastName:
 *                 type: string
 *                 description: The updated last name of the composer
 *     responses:
 *       '200':
 *         description: 'Ok: The request was successful.'
 *       '400':
 *         description: 'Bad Request: The request was malformed or invalid.'
 *       '404':
 *         description: 'Not Found: The requested resource could not be found.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */

router.put('/composers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName } = req.body;

//        throw new Error("Simulated 500 Error Test");       // THIS LINE WAS USED FOR TESTING 500 CALL


        if (!firstName || !lastName) {
            console.warn(`400 Bad Request: The request was malformed or invalid.\nfirstName=${firstName} lastName=${lastName}`);  
            return res.status(400).json({ message: "400 Bad Request: The request was malformed or invalid."});          
        }

        const updatedComposer = await Composer.findByIdAndUpdate(id, { firstName, lastName }, { new: true });

        if (!updatedComposer) {
            console.warn(`404 Not Found: The requested resource could not be found.\n${id}`);
            return res.status(404).json({ message: "404 Not Found: The requested resource could not be found." });
        }

        console.log(`200 Ok: The request was successful.\n${firstName} ${lastName}`);
        return res.status(200).json({ message: '200 Ok: The request was successful.' });

    } catch (err) {
        console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
        return res.status(500).json({ message: '500 Internal Server Error: A server error occurred.' });
    }
});







/**
 * deleteComposerById
 * @openapi
 * /api/composers/{id}:
 *   delete:
 *     tags:
 *       - Composers
 *     summary: Delete a composer by ID
 *     description: Removes a composer document from MongoDB based on the provided ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the composer to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: 'No Content: The request was successful but there is no content to return.'
 *       '400':
 *         description: 'Bad Request: The request was malformed or invalid.'
 *       '404':
 *         description: 'Not Found: The requested resource could not be found.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */

router.delete('/composers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // throw new Error("Simulated 500 Error Test");       // THIS LINE WAS USED FOR TESTING 500 CALL


        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.warn(`400 - Bad Request: The request was malformed or invalid.\n${id}`);
            return res.status(400).json({ message: "Bad Request: The request was malformed or invalid" });
          }

        const deletedComposer = await Composer.findByIdAndDelete(id);

        if (!deletedComposer) {
            console.warn(`404 Not Found: The requested resource could not be found.\n${id}`);
            return res.status(404).json({ message: '404 Not Found: The requested resource could not be found.' });
        }

        console.log(`204 No Content: The request was successful but there is no content to return.`);
        return res.status(204).send(); 

    } catch (err) {
        console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
        return res.status(500).json({ message: '500 Internal Server Error: A server error occurred.' });
    }
});




module.exports = router;

