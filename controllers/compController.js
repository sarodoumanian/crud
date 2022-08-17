const { component: Component, user: User } = require("../models/index");
const sequelize = require("sequelize");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  createComponent: async (req, res) => {
    const { title, code, catagory, subcatagory } = req.body;
    try {
      const component = await Component.create({
        title,
        code,
        catagory,
        subcatagory,
        image: req.file?.filename || "default.png",
        userId: req.user.id,
      });
      res.status(201).json(component);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getAllComponents: async (req, res) => {
    try {
      const componenets = await Component.findAll({
        where: { status: "approved" },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });
      res.status(200).json(componenets);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getNewComponents: async (req, res) => {
    try {
      const componenets = await Component.findAll({
        where: { status: "pending" },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });
      res.status(200).json(componenets);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  approveComponent: async (req, res) => {
    try {
      await Component.update({ status: "approved" }, { where: { id: req.body.id } });
      res.status(200).json({ msg: "component approved!!" });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  revertComponent: async (req, res) => {
    try {
      await Component.update({ status: "reverted" }, { where: { id: req.body.id } });
      res.status(200).json({ msg: "component reverted!!" });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  deleteComponent: async (req, res) => {
    const { id } = req.params;
    try {
      // const deletedComp = await Component.findOne({ where: { id } });
      await Component.destroy({ where: { id } });
      res.status(200).json({ msg: "component deleted!" });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getComponentById: async (req, res) => {
    try {
      const component = await Component.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: User,
            attributes: ["username", "id"],
          },
        ],
      });
      res.status(200).json(component);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getRevertedComponents: async (req, res) => {
    try {
      const components = await Component.findAll({ where: { userId: req.user.id, status: "reverted" } });
      res.status(200).json(components);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  search: async (req, res) => {
    try {
      const componenets = await Component.findAll({
        where: {
          [Op.or]: [
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("title")), "LIKE", `%${req.body.search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("code")), "LIKE", `%${req.body.search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("catagory")), "LIKE", `%${req.body.search}%`),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("subcatagory")), "LIKE", `%${req.body.search}%`),
          ],
        },
        include: [
          {
            model: User,
            attributes: ["username", "id"],
          },
        ],
      });
      res.status(200).json(componenets);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  updateReverted: async (req, res) => {
    const { id, title, catagory, subcatagory, code } = req.body;
    try {
      if (!title && !subcatagory && !code && !req.file) return res.json({ msg: "You Didn't change anything" });
      await Component.update({ status: "pending" }, { where: { id } });
      if (title) {
        await Component.update({ title }, { where: { id } });
      }
      if (code) {
        await Component.update({ code }, { where: { id } });
      }
      if (catagory) {
        await Component.update({ catagory }, { where: { id } });
      }
      if (subcatagory) {
        await Component.update({ subcatagory }, { where: { id } });
      }
      if (req.file) await Component.update({ image: req.file.filename }, { where: { id } });
      res.status(200).json({ successMsg: "component updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
