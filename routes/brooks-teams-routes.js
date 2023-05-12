/*
============================================
; Title: brooks-team-routes.js
; Author: Professor Krasso 
; Date: 05/10/2023
; Modified By: Brooks
; Description: Team API Routes.
============================================
*/ 

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
 *       '200':
 *         description: Team added to MongoDB
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */
router.post('/teams', async (req, res) => {
    try {
       // Create a new team document
       const newTeam = {
          name: req.body.name,
          mascot: req.body.mascot,
          players: req.body.players,
       };
       // Create a new team document 
       await Team.create(newTeam, function(err, team) {
          if (err) {
             console.log(err);
             res.status(501).send({
                message: `MongoDB Exception: ${err}`
             });
          } else {
             console.log(team);
             res.json(team);
          }
       });
    } catch (e) {
       console.log(e);
       res.status(500).send({
          message: `Server Exception: ${e.message}`
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
  *         description: Array of team documents
  *       '500':
  *         description: Server Exception.
  *       '501':
  *         description: MongoDB Exception.
  */
 router.get('/teams', async (req, res) => { 
    try {
       Team.find({}, function(err, teams) {
             if (err) {
                console.log(err);
                res.status(501).send({
                   message: `MongoDB Exception: ${err}`
                });
             } else {
                console.log(teams);
                res.json(teams);
             }
       });
    } catch (e) {
       console.log(e);
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
 *         description: Player assigned to team
 *       '401':
 *         description: Invalid team ID
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
router.post('/teams/:id/players', async (req, res) => {
   try {
      const teamName = req.params.id;
      const newPlayer = {
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         salary: req.body.salary
      };
      await Team.findOneAndUpdate( { _id: teamName }, { $push: { players: newPlayer } }, { new: true }, function(err, team) {
         if (err) {
            console.log(err);
            res.status(401).send({
               message: `Invalid team ID: ${err}`
            });
         } else {
            console.log(team);
            res.json(team);
         }
      });
   } catch (e) {
      console.log(e);
      res.status(500).send({
         message: `Server Exception: ${e.message}`
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
 *         description: Array of player documents
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */
router.get('/teams/:id/players', async (req, res) => {

   try {
      const teamId = req.params.id;

      await Team.findOne({ _id: teamId }, function(err, team) {
         if(err) {
            console.log(err);
            res.status(401).send({
               message: `Invalid team name: ${err}`
            });
         } else {
            console.log(team.players);
            res.json(team.players);
         }
      });
   } catch(e) {
      console.log(e);
      res.status(500).send({
         message: `Server Exception: ${e.message}`
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
 *         description: Team document
 *       '401':
 *         description: Invalid teamId
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */

router.delete('/teams/:id', async (req, res) => {
   try {
      const teamId = req.params.id;

      await Team.findOneAndDelete({ _id: teamId }, function (err, team) {
         if (err) {
            console.log(err);
            res.status(401).send({
               message: `Invalid teamId: ${err}`
            });
         } else {
            console.log(team);
            res.json(team);
         }
      });
   } catch (e) {
      console.log(e);
      res.status(500).send({
         message: `Server Exception: ${e.message}`
      });
   }
});



module.exports = router;