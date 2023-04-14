/*
============================================
; Title: person-composer.js
; Author: Professor Krasso 
; Date: 04/14/2023
; Modified By: Brooks
; Description: Creating new Schemas.
============================================
*/ 


// Add a require statement for mongoose and assign it to 
// a variable named mongoose.
const mongoose = require('mongoose');


// Add a new variable named Schema and assign it 
// the mongoose.Schema object. 
const Schema = mongoose.Schema;


// Create a schema named roleSchema.
const roleSchema = new Schema({
    text: { type: String }
});


// Create a schema named dependentSchema 
const dependentSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String }
});


// Create a schema named personSchema 
const personSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    roles: [roleSchema],
    dependents: [dependentSchema],
    birthDate: { type: String }
});


// Name the model “Person” and export it using module.exports
module.exports = mongoose.model('Person', personSchema);

