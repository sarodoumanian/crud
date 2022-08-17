const express = require("express");
const router = express.Router();
const catController = require("../controllers/catController");
const { userAuth, adminAuth, superAdminAuth } = require("../middleware/auth");

router.post("/", adminAuth, catController.addCatagory);

router.get("/", userAuth, catController.getAllCatagories);

router.delete("/:catagory", adminAuth, catController.deleteCatagory);

module.exports = router;
