// Middleware for handling auth

const jwt = require("jsonwebtoken");
const jwtpassword = "nishuissweet";

function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const token = req.headers.authorization; // bearer token

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      msg: "No token provided or format is incorrect. Please provide a valid Bearer token",
    });
  }

  const jwtToken = token.split(" ")[1]; // Extract token after "Bearer"

  try {
    const decodedValue = jwt.verify(jwtToken, jwtpassword);
    if (decodedValue.username) {
      next();
    } else {
      res.status(403).json({
        msg: "You are not authenticated !!! Only Nishu is authenticated ",
      });
    }
  } catch (e) {
    res.json({
      msg: "Invalid token",
    });
  }
}

module.exports = adminMiddleware;
