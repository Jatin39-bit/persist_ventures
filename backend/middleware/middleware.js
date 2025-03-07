const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistedTokenModel = require("../models/blacklistedToken.model");

module.exports.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token || token === "null") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (await blacklistedTokenModel.findOne({ token })) {
      return res.status(401).json({ message: "Unauthorizedd" });
    }
    const { id } = jwt.verify(token, process.env.SECRET);
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("middleware", error);
    res.status(500).json({ message: error.message });
  }
};
