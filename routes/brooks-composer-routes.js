/**
 * Title: brooks-composer-routes.js
 * Instructor: Professor Krasso
 * Author: Brooke Taylor
 * Date 4/8/23
 * Revision: 4/3/25
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
 *         description: Successfully retrieved composers
 *       '500':
 *         description: Internal Server Error
 */

router.get('/composers', async (req, res) => {
    try {
      const composers = await Composer.find({});
      console.log(`200 - Successfully retrieved ${composers.length} composers.`);
      res.status(200).json(composers);
    } catch (err) {
      console.error(err);
      console.error(`500 - Internal Server Error: ${err.message}`);
      res.status(500).json({ message: `Internal Server Error: ${err.message}` });
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
 *         description: Successfully retrieved composer
 *       '400':
 *         description: Bad Request - Missing or Invalid Fields
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

router.get('/composers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.warn(`400 - Bad Request: Missing or Invalid Fields: ${id}`);
            return res.status(400).json({ message: "Bad Request: Missing or Invalid Fields" });
        }

        const composer = await Composer.findById(id);

        if (!composer) {
            console.warn(`404 - Not Found: ${id}`);
            return res.status(404).json({ message: "404 - Not Found" });
        }

        console.log(`200 - Successfully retrieved: ${composer.firstName} ${composer.lastName}.`);
        res.status(200).json(composer);

    } catch (err) {
        console.error(`500 - Internal Server Error: ${err.message}`);
        res.status(500).json({ message: `Internal Server Error: ${err.message}` });
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
 *         description: Successfully created composer
 *       '400':
 *         description: Bad Request - Missing or Invalid Fields
 *       '409':
 *         description: Composer already exists
 *       '500':
 *         description: Internal Server Error
 */

router.post('/composers', async (req, res) => {
    try {
        const { firstName, lastName } = req.body; 

        if (!firstName || !lastName) {
            console.warn(`400 - Bad Request - Missing or Invalid Fields: firstName=${firstName} lastName=${lastName}`);
            return res.status(400).json({ message: `Bad Request - Missing or Invalid Fields: firstName=${firstName} lastName=${lastName}` });
        }

        const existingComposer = await Composer.findOne({ firstName, lastName });

        if (existingComposer) {
            console.warn(`409 - Composer already exists: ${firstName} ${lastName}`);
            return res.status(409).json({ message: `Composer with name ${firstName} ${lastName} already exists` });
        }

        const newComposer = new Composer({ firstName, lastName });
        const savedComposer = await newComposer.save();

        console.log(`201 - Successfully created ${savedComposer.firstName} ${savedComposer.lastName}`);
        res.status(201).json(savedComposer); 

    } catch (err) {
        console.error(`500 - Internal Server Error: ${err.message}`);
        res.status(500).json({ message: `Internal Server Error: ${err.message}` });
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
 *         description: Successfully updated composer
 *       '400':
 *         description: Bad Request - Missing or Invalid Fields
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

router.put('/composers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({ message: "Bad Request - Missing or Invalid Fields"});            
        }

        const updatedComposer = await Composer.findByIdAndUpdate(id, { firstName, lastName}, { new: true });

        if (!updatedComposer) {
            return res.status(404).json({ message: "Composer not found" });
        }

        console.log(`200 - Successfully updated ${firstName} ${lastName}`);
        res.status(200).json({ message: `Successfully updated ${firstName} ${lastName}.`});

    } catch (err) {
        console.error(`500 - Internal Server Error: ${err.message}`);
        res.status(500).json({ message: `Internal Server Error: ${err.message}` });
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
 *         description: No Content
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

router.delete('/composers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.warn(`400 - Bad Request: Invalid ObjectId format: ${id}`);
            return res.status(400).json({ message: "Bad Request: Invalid ID format" });
          }

        const deletedComposer = await Composer.findByIdAndDelete(id);

        if (!deletedComposer) {
            console.warn(`404 - Composer not found for ID: ${id}`);
            return res.status(404).json({ message: "Composer not found" });
        }

        console.log(`204 - Successfully deleted composer with ID: ${id}`);
        return res.status(204).send(); 

    } catch (err) {
        console.error(`500 - Internal Server Error: ${err.message}`);
        return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    }
});




module.exports = router;

