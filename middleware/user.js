const jwt = require("jsonwebtoken");
jwtpassword = "secret";

function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "No token provided",
    });
  }

  jwt.verify(token, jwtpassword, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token",
      });
    }
    req.username = decoded.username;
    next();
  });
}

module.exports = userMiddleware;
