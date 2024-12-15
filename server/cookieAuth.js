const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authorization = (req, res, next) => {
  // Look for the token in cookies
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(403);  // No token found, send Forbidden response
  }

  try {
    // Verify the token with your JWT secret (ensure JWT_KEY is set in .env)
    const data = jwt.verify(token, process.env.JWT_KEY);

    // Attach user data to the request object
    req.userId = data.id;    // Assuming JWT contains id
    req.userRole = data.role;  // Assuming JWT contains role
    
    return next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.sendStatus(403);  // Token is invalid, send Forbidden response
  }
};

module.exports = { authorization };
