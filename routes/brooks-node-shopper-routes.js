/*
============================================
; Title: brooks-node-shopper-routes.js
; Author: Professor Krasso 
; Date: 04/27/2023
; Modified By: Brooks
; Description: Routes for Customer Shopper. 
============================================
*/ 

const express = require('express');
const router = express.Router();
const Customer = require('../models/brooks-customer');

// Create three operations: 
// createCustomer, creatInvoiceByUserName, and findAllInvoicesByUserName

/**
 * 
 * createCustomer
 * @openapi
 * /api/customers:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Creates a new customer object.
 *     description: API for adding new customer object.
 *     requestBody:
 *       description: Customer information
 *       content:
 *         application/json:
 *           schema:
 *             required: 
 *               - firstName
 *               - lastName
 *               - userName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Array of person documents. 
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception
 * 
 */

router.post('/customers', async (req, res) => {

    try {

        const newCustomer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName
        }

        Customer.create(newCustomer, function (err, customer) {

            if (err) {
                console.log(err);
                res.status(501).send({
                    message: `MongoDB Exception: ${err}`,
                });
            } else {
                console.log(customer);
                res.json(customer);
            }

        }); 

    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Server Exception',
        });
    }

});




/**
 * 
 * createInvoiceByUserName
 * @openapi
 * /api/customers/{userName}/invoices:
 *   post:
 *     tags:
 *       - Customers
 *     summary: Creates a new invoice.
 *     description: API for creating an invoice by userName.
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         description: userName search for collection
 *         schema:
 *           type: string

 *     requestBody:
 *       description: Invoice information
 *       content:
 *         application/json:
 *           schema:
 *             required: 
 *               - subtotal
 *               - tax
 *               - dateCreated
 *               - dateShipped
 *               - lineItems
 *             properties:
 *               subtotal:
 *                 type: string
 *               tax:
 *                 type: string
 *               dateCreated:
 *                 type: string
 *               dateShipped:
 *                 type: string
 *               lineItems:
 *                 type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   quantity:
 *                     type: number
 *     responses:
 *       '200':
 *         description: Array of person documents. 
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception
 * 
 */

router.post('/customers/:userName/invoices', async (req, res) => {
    try{
        Customer.findOne({ userName: req.params.userName }, function (err, customer) {
            let newInvoice = {
                subtotal: req.body.subtotal,
                tax: req.body.tax,
                dateCreated: req.body.dateCreated,
                dateShipped: req.body.dateShipped,
                lineItems: req.body.lineItems
            }
            if (err) {
                console.log(err);
                res.status(501).send({
                    message: `MongoDB Exception: ${err}`
                });
            } else {
                console.log(customer);
                customer.invoices.push(newInvoice);
                customer.save(function (err, invoice) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(invoice);
                        res.json(invoice);
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Server Exception: ${error.message}`
        });
    }
});




/**
 * 
 * findAllInvoicesByUserName
 * @openapi
 * /api/customers/{username}/invoices:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Retrieves invoices by userName.
 *     description: API for retrieving invoices.
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Search for invoices by userName.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of person documents. 
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception
 * 
 */

router.get('/customers/:userName/invoices', async (req, res) => {
    try {
        Customer.findOne({ userName: req.params.userName }, function (err, customer) {
            if (err) {
                console.log(err);
                res.status(501).send({
                    message: `MongoDB Exception: ${err}`
                });
            } else {
                console.log(customer.invoices);
                res.json(customer.invoices);
            }
         });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Server Exception: ${error.message}`
        });
    }
});

module.exports = router;

