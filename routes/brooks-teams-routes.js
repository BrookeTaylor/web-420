/**
 * Title: brooks-teams-routes.js
 * Instructor: Professor Krasso
 * Author: Brooke Taylor
 * Date 5/10/23
 * Revision: 4/9/25
 * Description: Team API Routes.
 */

const mongoose = require('mongoose');

// Add the appropriate requirement statements 
// (express, router, and Person).
const express = require('express');


// Create a variable named router and assign it 
// the express.Router() function. 
const router = express.Router();

const Team = require('../models/brooks-teams');



/**
 * createTeam
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     description: API for creating a new team document
 *     summary: Creates a new team document.
 *     requestBody:
 *       description: Team information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - mascot
 *               - players
 *             properties:
 *               name:
 *                 type: string
 *               mascot:
 *                 type: string
 *               players:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     salary:
 *                       type: number
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



 router.post('/teams', async (req, res) => {
   try {
       const { name, mascot, players } = req.body;

       if (!name || !mascot || !Array.isArray(players) || players.length === 0) {
           console.warn(`400 Bad Request: The request was malformed or invalid.`);
           return res.status(400).send({
               message: '400 Bad Request: The request was malformed or invalid.'
           });
       }

       const existingTeam = await Team.findOne({ name });
       if (existingTeam) {
           console.warn(`409 Conflict: The request could not be completed due to a conflict.\nname=${name}`);
           return res.status(409).send({
               message: `409 Conflict: The request could not be completed due to a conflict.`
           });
       }

       const newTeam = await Team.create({ name, mascot, players });

       console.log(`201 Created: A new resource has been successfully created.`);
       res.status(201).send(newTeam);

   } catch (e) {
       console.error(`500 Internal Server Error: A server error occurred.`);
       res.status(500).send({
           message: `500 Internal Server Error: A server error occurred.`
       });
   }
});

 
 
 
 // find All Teams
 /**
  * findAllTeams
  * @openapi
  * /api/teams:
  *   get:
  *     tags:
  *       - Teams
  *     description: API for returning a list of all teams
  *     summary: return all teams.
  *     responses:
  *       '200':
  *         description: 'Ok: The request was successful.'
  *       '500':
  *         description: 'Internal Server Error: A server error occurred.'
  */
 router.get('/teams', async (req, res) => {
   try {
       const teams = await Team.find({});
       console.log(`200 Ok: The request was successful.`);
       res.status(200).json(teams);
   } catch (e) {
       console.error(`500 Internal Server Error: A server error occurred.`);
       res.status(500).send({
           message: `Server Exception: ${e.message}`
       });
   }
});




// assign a player to a team
/**
 * assignPlayerToTeam
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     tags:
 *       - Teams
 *     description: API for assigning a player to a team
 *     summary: assigns player to a team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: teamId of team.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: new player information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               salary:
 *                 type: number
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

router.post('/teams/:id/players', async (req, res) => {
   try {
     const teamId = req.params.id;

     if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).send({
        message: `400 Bad Request: The request was malformed or invalid. ${teamId}`
      });
    }

     const newPlayer = {
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       salary: req.body.salary
     };
 
     if (
       !newPlayer.firstName ||
       !newPlayer.lastName ||
       typeof newPlayer.salary !== 'number'
     ) {
       console.warn('400 Bad Request: The request was malformed or invalid');
       return res.status(400).send({
         message: '400 Bad Request: The request was malformed or invalid).'
       });
     }
 
     const updatedTeam = await Team.findOneAndUpdate(
       { _id: teamId },
       { $push: { players: newPlayer } },
       { new: true }
     );
 
     if (!updatedTeam) {
       console.warn(`404 Not Found: The requested resource could not be found\n${teamId}`);
       return res.status(404).send({
         message: `404 Not Found: The requested resource could not be found.`
       });
     }
 
     console.log('200 Ok: The request was successful', updatedTeam);
     res.status(200).json(updatedTeam);
 
   } catch (e) {
     console.error('500 Internal Server Error: A server error occurred', e);
     res.status(500).send({
       message: `500 Internal Server Error: A server error occurred.}`
     });
   }
 });
 








// find all player by teamId
/**
 * findAllPlayersByTeamId
 * @openapi
 * /api/teams/{id}/players:
 *   get:
 *     tags:
 *       - Teams
 *     description: API for returning a list of players by teamId from MongoDB Atlas
 *     summary: returns a list of player documents
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: teamId of the team
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
router.get('/teams/:id/players', async (req, res) => {
   try {
     const teamId = req.params.id;
 
     if (!mongoose.Types.ObjectId.isValid(teamId)) {
       console.warn(`400 Bad Request: The request was malformed or invalid.\n${teamId}`);
       return res.status(400).send({
         message: `400 Bad Request: The request was malformed or invalid`
       });
     }
 
     const team = await Team.findOne({ _id: teamId });
 
     if (!team) {
       console.warn(`404 Not Found: The requested resource could not be found\n${teamId}`);
       return res.status(404).send({
         message: `404 Not Found: The requested resource could not be found`
       });
     }
 
     console.log(`200 OK: The request was successful.`);
     res.status(200).json(team.players);
   } catch (e) {
     console.error(`500 Internal Server Error: A server error occurred.\n${e.message}`);
     res.status(500).send({
       message: `500 Internal Server Error: A server error occurred.`
     });
   }
 });







// delete team by teamID
/**
 * deleteTeamById
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     description: API for deleting a team
 *     summary: deletes a team 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: teamId of the team requested by the user
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

router.delete('/teams/:id', async (req, res) => {
   try {
     const teamId = req.params.id;
 
     if (!mongoose.Types.ObjectId.isValid(teamId)) {
       console.warn(`400 Bad Request: The request was malformed or invalid.\n${teamId}`);
       return res.status(400).send({
         message: `400 Bad Request: The request was malformed or invalid.`
       });
     }
 
     const result = await Team.findByIdAndDelete(teamId);
 
     if (!result) {
       console.warn(`404 Not Found: The requested resource could not be found.\n${teamId}`);
       return res.status(404).send({
         message: `404 Not Found: The requested resource could not be found.`
       });
     }
 
     console.log(`200 Ok: The request was successful.`);
     res.status(200).send({
       message: `200 Ok: The request was successful.`
     });
   } catch (e) {
     console.error(`500 Internal Server Error: A server error occurred.\n${e.message}`);
     res.status(500).send({
       message: `500 Internal Server Error: A server error occurred.`
     });
   }
 });



module.exports = router;