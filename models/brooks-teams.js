/*
============================================
; Title: brooks-team.js
; Author: Professor Krasso 
; Date: 05/10/2023
; Modified By: Brooks
; Description: Creating team/player Schemas.
============================================
*/ 


// Add a require statement for mongoose and assign it to 
// a variable named mongoose.
const mongoose = require('mongoose');


// Add a new variable named Schema and assign it 
// the mongoose.Schema object. 
const Schema = mongoose.Schema;



// Create a schema named playerSchema.
const playerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    salary: { type: Number }
});



// Create a schema named teamSchema 
const teamSchema = new Schema({
    name: { type: String },
    mascot: { type: String },
    players: [playerSchema]
});



// Name the model “Person” and export it using module.exports
module.exports = mongoose.model('Team', teamSchema);

