const { catagory: Catagory } = require("../models/index");

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

module.exports = {
  addCatagory: async (req, res) => {
    try {
      const existingCatagory = await Catagory.findOne({ where: { catagory: capitalize(req.body.catagory) } });
      if (existingCatagory) return res.json({ msg: "This category already exists!" }).status(400);
      const catagory = await Catagory.create({
        catagory: capitalize(req.body.catagory),
      });
      res.status(201).json(catagory);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  getAllCatagories: async (req, res) => {
    try {
      const catagories = await Catagory.findAll({ attributes: ["catagory"], order: [["createdAt", "ASC"]] });
      const arr = [];
      catagories.forEach((c) => arr.push(c.catagory));
      res.status(200).json(arr);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  deleteCatagory: async (req, res) => {
    const { catagory } = req.params;
    try {
      const deleted = await Catagory.findOne({ where: { catagory } });
      await Catagory.destroy({ where: { catagory } });
      res.status(200).json(deleted.catagory);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};
