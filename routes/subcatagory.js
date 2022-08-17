const express = require("express");
const router = express.Router();
const subcatController = require("../controllers/subcatController");
const { userAuth, adminAuth, superAdminAuth } = require("../middleware/auth");

router.post("/", adminAuth, subcatController.addSubcatagory);

router.get("/", userAuth, subcatController.getAllSubCatagories);

router.delete("/:subcatagory", adminAuth, subcatController.deleteSubCatagory);

module.exports = router;
