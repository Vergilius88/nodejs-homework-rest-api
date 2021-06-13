const express = require('express');
const router = express.Router();
const contactsController = require('../../controllers/contacts');
const validate = require('./validation.js');

router.get('/', contactsController.getContactsList);

router.get('/:id', contactsController.getContactById);

router.post('/', validate.createContact, contactsController.addContact);

router.delete('/:id', contactsController.removeContact);

router.patch('/:id', validate.updateContact, contactsController.updateContact);

module.exports = router;