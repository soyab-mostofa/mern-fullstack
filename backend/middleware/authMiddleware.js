const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from headers
      token = req.headers.authorization.split(" ")[1];

      // verify jwt token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // get user from user model useing decoded id

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      throw new Error("not authorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("no authorization token");
  }
});

module.exports = { protect };
