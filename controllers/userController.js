const { user: User } = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

module.exports = {
  createUser: async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      const existingUser = User.findOne({ where: { username } });
      if (existingUser) return res.status(400).json("Username is already used, try something else!");

      const existingUser1 = User.findOne({ where: { email } });
      if (existingUser1) return res.status(400).json("Email is already used, try something else!");

      const hashed = await bcrypt.hash(password, 8);
      const user = await User.create({
        username,
        email,
        password: hashed,
        role
      });
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // createAdmin: async (req, res) => {
  //   const { username, email, password } = req.body;
  //   try {
  //     const hashed = await bcrypt.hash(password, 8);
  //     const user = await User.create({
  //       username,
  //       email,
  //       password: hashed,
  //       role: "admin",
  //     });
  //     res.status(200).json(user);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json(error);
  //   }
  // },
  getOnlyUsers: async (req, res) => {
    try {
      const users = await User.findAll({ where: { role: "user" }, attributes: ["id", "username", "email", "createdAt"], order: [["createdAt", "ASC"]] });
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
          [Op.or]: [{ role: "admin" }, { role: "user" }]
        },
        attributes: ["id", "username", "email", "role", "createdAt"],
        order: sequelize.fn("field", sequelize.col("role"), "admin", "user")
      });
      res.status(200).json(users);
    } catch (error) {
      // console.log(error);
      res.status(500).json(error);
    }
  },
  getAllAdmins: async (req, res) => {
    try {
      const admins = await User.findAll({ where: { role: "admin" }, attributes: ["id", "username", "email", "createdAt"], order: [["createdAt", "ASC"]] });
      res.status(200).json(admins);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params;
    if (req.user.role === "user" && req.user.id !== id) return res.status(400).json({ msg: "you cannot access someone else's account" });
    try {
      const user = await User.findOne({ where: { id }, attributes: ["id", "username", "email", "role", "createdAt"] });
      if (!user) return res.status(404).json({ msg: "No user with such id" });
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  signin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) return res.json({ errMsg: "username or password is incorrect" }).status(401);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.json({ errMsg: "username or password is incorrect" }).status(401);
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "5h" });
      delete user.dataValues.password;
      res
        .cookie("token", token, { maxAge: 5 * 60 * 60 * 1000, httpOnly: true })
        .cookie("user_id", user.id, { maxAge: 5 * 60 * 60 * 1000 })
        .status(200)
        .json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  deleteUser: async (req, res) => {
    try {
      await User.destroy({ where: { id: req.params.id } });
      res.status(200).json({ msg: "user deleted successfully" });
    } catch (error) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  changePassword: async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    try {
      const user = await User.findOne({ where: { id: req.user.id } });
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.json({ Msg: "Old password is incorrect" });
      if (newPassword !== confirmPassword) return res.json({ Msg: "new password and confirm password should be the same" });
      const hashed = await bcrypt.hash(newPassword, 8);
      await User.update({ password: hashed }, { where: { id: req.user.id } });
      res.status(200).json({ Msg: "password successfully changed" });
    } catch (error) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  updateUser: async (req, res) => {
    const { id, username, email, role } = req.body;
    try {
      const user = await User.findOne({ where: { id } });

      if (user.role === "admin" && req.user.role === "admin") return res.status(400).json({ msg: "You can only update users, not admins" });

      if (username) {
        await User.update({ username }, { where: { id } });
      }
      if (email) {
        await User.update({ email }, { where: { id } });
      }
      if (role) {
        await User.update({ role }, { where: { id } });
      }
      res.status(200).json({ msg: "user updated successfully" });
    } catch (error) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  logout: (_, res) => {
    res.clearCookie("token").clearCookie("user_id").json({ msg: "logged out" });
  }
};
