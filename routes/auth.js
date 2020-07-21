const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route     GET api/auth
// @desc      get a logged in user
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.send(user);
  } catch(err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    log in a user
// @access  Private
router.post(
  '/', 
  [
    check('email', 'Please enter a email').isEmail(),
    check('password', 'Please enter a password').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    
    const { email, password } = req.body;

    try {
      
      // Check if user email is in DB
      let user = await User.findOne({ email });
      if(!user)
        return res.status(400).json({ msg: 'Invalid Credentials' });

      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch)
        return res.status(400).json({ msg: 'Invalid Credentials' });
      
      // Create and Send JWT  
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: config.get('expiresIn')}, (err, token) => {
        if(err)
          throw err;
        res.json({ token });
      })
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
); 

module.exports = router;