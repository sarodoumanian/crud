const jwt = require("jsonwebtoken");
const { user: User } = require("../models/index");

module.exports = {
  shouldBeSignedOut: async (req, res, next) => {
    const token = req.cookies.token;
    console.log("JWT token: " + req.cookies.token);
    if (!token) return next();
    res.json({ msg: "you are already signed in" });
  },
  //all users --> users, admins, superadmins
  userAuth: async (req, res, next) => {
    const token = req.cookies.token;
    console.log("JWT token: " + req.cookies.token);
    if (!token) {
      return res.status(403).json({ msg: "A token is required for authentication" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        const user = await User.findOne({ where: { id: decoded.id } });
        req.user = user;
      } else {
        res.json({ msg: "token expired" });
      }
    } catch (err) {
      console.log(err);
    }
    return next();
  },
  // admin and super admin
  adminAuth: async (req, res, next) => {
    const token = req.cookies.token;
    console.log("JWT token: " + req.cookies.token);
    if (!token) {
      return res.status(403).send({ msg: "A token is required for authentication" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        const user = await User.findOne({ where: { id: decoded.id } });
        req.user = user;
      } else {
        res.json({ msg: "token expired" });
      }
    } catch (err) {
      console.log(err);
    }
    if (req.user.role === "admin" || req.user.role === "superAdmin") return next();
    else res.json({ msg: "only ADMINS and SUPERADMINS can access this route" });
  },
  // only superadmins
  superAdminAuth: async (req, res, next) => {
    const token = req.cookies.token;
    console.log("JWT token: " + req.cookies.token);
    if (!token) {
      return res.status(403).send({ msg: "A token is required for authentication" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded) {
        const user = await User.findOne({ where: { id: decoded.id } });
        req.user = user;
      } else {
        res.json({ msg: "token expired" });
      }
    } catch (err) {
      console.log(err);
    }
    if (req.user.role === "superAdmin") return next();
    else res.json({ msg: "only SUPERADMINS can access this route" });
  }
};
