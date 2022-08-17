const { subcatagory: Subcatagory } = require("../models/index");

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

module.exports = {
  addSubcatagory: async (req, res) => {
    try {
      const existingSubcatagory = await Subcatagory.findOne({ where: { subcatagory: capitalize(req.body.subcatagory) } });
      if (existingSubcatagory) return res.json({ msg: "This SubCategory already exists!" }).status(400);
      const subcatagory = await Subcatagory.create({
        subcatagory: capitalize(req.body.subcatagory),
      });
      res.status(201).json(subcatagory);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getAllSubCatagories: async (req, res) => {
    try {
      const subcatagories = await Subcatagory.findAll({ attributes: ["subcatagory"], order: [["createdAt", "ASC"]] });
      const arr = [];
      subcatagories.forEach((c) => arr.push(c.subcatagory));
      res.status(200).json(arr);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  deleteSubCatagory: async (req, res) => {
    const { subcatagory } = req.params;
    try {
      const deleted = await Subcatagory.findOne({ where: { subcatagory } });
      await Subcatagory.destroy({ where: { subcatagory } });
      res.status(200).json(deleted.subcatagory);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};
