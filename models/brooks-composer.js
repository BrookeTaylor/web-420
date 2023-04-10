/*
============================================
; Title: brooks-composer.js
; Author: Professor Krasso 
; Date: 04/08/2023
; Modified By: Brooks
; Description: Created a composerSchema.
============================================
*/ 


// Add a require statement for mongoose and assign it to 
// a variable named mongoose.
const mongoose = require('mongoose');


// Add a new variable named Schema and assign it 
// the mongoose.Schema object. 
const Schema = mongoose.Schema;


// Create a schema named composerSchema with the following fields: 
const composerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String }
});


// Name the model “Composer” and export it using module.exports
module.exports = mongoose.model('Composer', composerSchema);

