const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST api/users
// @desc    Create a new user
// @access  Public
router.post(
  '/', 
  [
    check('name', 'Please enter a name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be atleast 6 characters').isLength({
      min: 6
    })
  ], 
  async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if(user)
      return res.status(400).send({ error: "email already exists" });
    

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    }

    const token = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: config.get('expiresIn')}, (err, token) => {
      if(err)
        throw err;
      res.send({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

module.exports = router;