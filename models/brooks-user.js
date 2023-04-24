/*
============================================
; Title: brooks-user.js
; Author: Professor Krasso 
; Date: 04/21/2023
; Modified By: Brooks
; Description: Creates a new userSchema. 
============================================
*/ 


// Add a require statement for mongoose and assign it to 
// a variable named mongoose.
const mongoose = require('mongoose');

// Add a new variable named Schema and assign it the mongoose.Schema object. 
const Schema = mongoose.Schema;

// Create a schema named userSchema with the following fields: 
const userSchema = mongoose.Schema({
    userName: { type: String },
    password: { type: String },
    emailAddress: { type: String }
});


// Name the model “User” and export it using module.exports
module.exports = mongoose.model('User', userSchema);