const jwt = require('jsonwebtoken');
const config = require('config'); 

module.exports = function(req, res, next) {
  // Check for token
  const token = req.header('x-auth-token');
  if(!token)
    return res.status(401).json({ msg: "No Token, Authorization Denied" });
  
  try {
    // Decode the token
    const decode = jwt.verify(token, config.get('jwtSecret'));
    // Set user in req obj 
    req.user = decode.user;
    next();
  } catch(err) {
    console.log(err.message);
    res.status(401).json({ msg: "Token not valid" });
  }
}