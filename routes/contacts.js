const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Contact = require('../models/Contact');
const { check, validationResult } = require('express-validator');

// @route   GET api/contacts
// @desc    get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
    res.json(contacts);
  } catch(err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/contacts
// @desc    create a new contact
// @access  Private
router.post(
  '/', 
  [auth, 
   [
     check('name', 'Please enter a name').notEmpty()
   ]
  ], 
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    
    const { name, email, phone, type } = req.body;

    try {
      // Create new contact and send it
      const newContact = new Contact({
        user: req.user.id,
        name,
        email,
        phone,
        type
      });
      
      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

  }
);

// @route   PUT api/contacts/:id
// @desc    update a contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;
  
  const contactFields = {};
  if(name) contactFields.name = name;
  if(email) contactFields.email = email;
  if(phone) contactFields.phone = phone;
  if(type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if(!contact)
      return res.status(404).json({ msg: 'Contact not found' });

    if(contact.user.toString() !== req.user.id) 
      return res.status(401).json('Not Authorized');
    
    contact = await Contact.findByIdAndUpdate(req.params.id, 
      { $set: contactFields },
      { new: true });
    
    res.json(contact);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/contacts/:id
// @desc    delete a contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if(!contact)
      return res.status(404).json({ msg: 'Contact not found' });

    if(contact.user.toString() !== req.user.id) 
      return res.status(401).json('Not Authorized');
    
    await Contact.findOneAndRemove(req.params.id);

    res.json({ msg: 'Contact Removed' });
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;