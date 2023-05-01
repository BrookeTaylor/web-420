/*
============================================
; Title: brooks-customer.js
; Author: Professor Krasso 
; Date: 04/26/2023
; Modified By: Brooks
; Description: Setting up Schemas for lineItem, invoice, and customer.
============================================
*/ 

// Add a require statement for mongoose and assign it to 
// a variable named mongoose.
const mongoose = require('mongoose');

// Add a new variable named Schema and assign it the mongoose.Schema object. 
const Schema = mongoose.Schema;

// Create a schema named lineItemSchema with the following fields: 
const lineItemSchema = new Schema({
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number }
});

// Create a schema named invoice with the following fields: 
const invoice = new Schema({
    subtotal: { type: Number },
    tax: { type: Number },
    dateCreated: { type: String },
    dateShipped: { type: String },
    lineItems: [ lineItemSchema ]
});

// Create a schema named customerSchema with the following fields: 
const customerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    invoices: [ invoice ]
});

// Name the model “Customer” and export it using module.exports
module.exports = mongoose.model('Customer', customerSchema);

