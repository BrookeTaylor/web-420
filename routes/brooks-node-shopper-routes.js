/**
 * Title: brooks-node-shopper-routes.js
 * Instructor: Professor Krasso
 * Author: Brooke Taylor
 * Date 4/27/23
 * Revision: 4/5/25
 * Description: Routes for Customer Shopper.
 */

const express = require('express');
const router = express.Router();
const Customer = require('../models/brooks-customer');





/**
 * findAllCustomers
 * @openapi
 * /api/customers:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Returns a list of all customer documents
 *     responses:
 *       '200':
 *         description: 'Ok: The request was successful.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */
router.get('/customers', async (req, res) => {

    try {

//        throw new Error("Simulated 500 Error Test");       // THIS LINE WAS USED FOR TESTING 500 CALL
        const customers = await Customer.find({});

        console.log(`200 Ok: The request was successful.\nFound ${customers.length} customers.`);
        return res.status(200).json(customers);

    } catch (err) {
        console.error(err);
        console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
        return res.status(500).json({ message: '500 Internal Server Error: A server error occurred.' });
    }
});



// Create three operations: 
// createCustomer, createInvoiceByUserName, and findAllInvoicesByUserName

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
 *       '201':
 *         description: 'Created: A new resource has been successfully created.'
 *       '400':
 *         description: 'Bad Request: The request was malformed or invalid.'
 *       '409':
 *         description: 'Conflict: The request could not be completed due to a conflict.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */

router.post('/customers', async (req, res) => {
    try {
        const { firstName, lastName, userName } = req.body;

//        throw new Error('Simulated 500 Error Test');       // THIS LINE WAS USED FOR TESTING 500 CALL


        if (!firstName || !lastName || !userName) {
            console.warn(`400 Bad Request: The request was malformed or invalid.\nfirstName=${firstName} lastName=${lastName} userName=${userName}`);
            return res.status(400).json({
                message: '400 Bad Request: The request was malformed or invalid.',
            });
        }


        const existingCustomer = await Customer.findOne({ userName });


        if (existingCustomer) {
            console.warn(`409 Conflict: The request could not be completed due to a conflict.\n${userName}`);
            return res.status(409).json({
                message: '409 Conflict: The request could not be completed due to a conflict.',
            });
        }


        const newCustomer = new Customer({
            firstName,
            lastName,
            userName,
            invoices: [], 
        });


        const savedCustomer = await newCustomer.save();

        console.log(`201 Created: A new resources has been successfully created.\n${userName} firstName=${firstName} lastName=${lastName}`);
        return res.status(201).json(savedCustomer);

    } catch (err) {

        console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
        return res.status(500).json({
            message: '500 Internal Server Error: A server error occurred.',
        });
    }
});





/**
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
 *         description: userName of the customer
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Invoice information
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subtotal
 *               - tax
 *               - dateCreated
 *               - dateShipped
 *               - lineItems
 *             properties:
 *               subtotal:
 *                 type: number
 *               tax:
 *                 type: number
 *               dateCreated:
 *                 type: string
 *               dateShipped:
 *                 type: string
 *               lineItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - price
 *                     - quantity
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *     responses:
 *       '201':
 *         description: 'Created: A new resource has been successfully created.'
 *       '400':
 *         description: 'Bad Request: The request was malformed or invalid.'
 *       '404':
 *         description: 'Not Found: The requested resource could not be found.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */

router.post('/customers/:userName/invoices', async (req, res) => {
  const { userName } = req.params;
  const { subtotal, tax, dateCreated, dateShipped, lineItems } = req.body;

  if (isNaN(subtotal) || isNaN(tax)) {
    console.warn(`400 Bad Request: The request was malformed or invalid.\nsubtotal=${subtotal}, total=${total}`);
    return res.status(400).json({
      message: '400 Bad Request: The request was malformed or invalid.',
    });
  }

  
  if (
    !dateCreated || !dateShipped || 
    !lineItems || !Array.isArray(lineItems) ||
    lineItems.some(item => !item.name || item.price == null || item.quantity == null)
  ) {
    console.warn(`400 Bad Request: The request was malformed or invalid.`);
    return res.status(400).json({
      message: '400 Bad Request: The request was malformed or invalid.',
    });
  }

  try {

//    throw new Error('Simulated 500 Error Test');       // THIS LINE WAS USED FOR TESTING 500 CALL

    const customer = await Customer.findOne({ userName });

    if (!customer) {
      console.warn(`404 Not Found: The requested resource could not be found.\n"${userName}".`);
      return res.status(404).json({
        message: '404 Not Found: The requested resource could not be found.',
      });
    }

    const invoice = {
      subtotal,
      tax,
      dateCreated,
      dateShipped,
      lineItems,
    };

    customer.invoices.push(invoice);

    await customer.save();

    console.log(`201 Created: A new resource has been successfully created.`);
    return res.status(201).json({
      message: `201 Created: A new resource has been successfully created.`,
      invoice,
    });

  } catch (err) {
    console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
    return res.status(500).json({
      message: '500 Internal Server Error: A server error occurred.',
    });
  }
});






/**
 * @openapi
 * /api/customers/{userName}/invoices:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Retrieves all invoices for a specific customer.
 *     description: API for retrieving all invoices by userName.
 *     parameters:
 *       - name: userName
 *         in: path
 *         required: true
 *         description: userName of the customer
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 'Ok: The request was successful.'
 *       '400':
 *         description: 'Bad Request: Invalid or missing userName.'
 *       '404':
 *         description: 'Not Found: The request was malformed or invalid.'
 *       '500':
 *         description: 'Internal Server Error: A server error occurred.'
 */

router.get('/customers/:userName/invoices', async (req, res) => {
  const { userName } = req.params;

  if (!userName || typeof userName !== 'string') {
    console.warn(`400 Bad Request: The request was malformed or invalid.`)
    return res.status(400).json({
      message: '400 Bad Request: The request was malformed or invalid.',
    });
  }

  try {

//    throw new Error('Simulated 500 Error Test');       // THIS LINE WAS USED FOR TESTING 500 CALL

    const customer = await Customer.findOne({ userName });

    if (!customer) {
      console.warn(`404 Not Found: The requested resource could not be found.\n${userName}`)
      return res.status(404).json({
        message: '404 Not Found: The requested resource could not be found.',
      });
    }

    console.log(`200 Ok: The request was successful.\nFound ${customer.invoices.length} invoices.`)
    return res.status(200).json(customer.invoices);
    
  } catch (err) {
    console.error(`500 Internal Server Error: A server error occurred.\n${err.message}`);
    return res.status(500).json({
      message: '500 Internal Server Error: A server error occurred.',
    });
  }
});






module.exports = router;

