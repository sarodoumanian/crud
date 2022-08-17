const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const router = express.Router();
const { userAuth, adminAuth, superAdminAuth } = require("../middleware/auth");
const compController = require("../controllers/compController");
const userValidation = require("../validation");

const multerConfig = {
  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function (req, file, next) {
      next(null, "public/uploads/");
    },

    //Then give the file a unique name
    filename: function (req, file, next) {
      //console.log(file);
      const ext = file.mimetype.split("/")[1];
      next(null, +Date.now() + "." + file.originalname);
    }
  }),

  //A means of ensuring only images are uploaded.
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith("image/");
    if (image) {
      console.log("photo uploaded");
      next(null, true);
    } else {
      console.log("file not supported");

      return next();
    }
  }
};

router.post("/", userAuth, multer(multerConfig).single("photo"), validate(userValidation.createComponentEndpoint, {}, { abortEarly: false }), compController.createComponent);

router.get("/", userAuth, compController.getAllComponents);

router.get("/new", adminAuth, compController.getNewComponents);

router.get("/reverted", userAuth, compController.getRevertedComponents);

router.get("/:id", userAuth, compController.getComponentById);

router.patch("/", adminAuth, compController.approveComponent);

router.patch("/revert", adminAuth, compController.revertComponent);

router.patch("/updateReverted", userAuth, multer(multerConfig).single("photo"), compController.updateReverted);

router.post("/search", userAuth, compController.search);

router.delete("/:id", adminAuth, compController.deleteComponent);

module.exports = router;
