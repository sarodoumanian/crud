const express = require("express");
const { validate } = require("express-validation");
const router = express.Router();
const userController = require("../controllers/userController");
const { userAuth, adminAuth, superAdminAuth, shouldBeSignedOut } = require("../middleware/auth");
const userValidation = require("../validation");

router.post("/", adminAuth, validate(userValidation.userSignUpEndpoint, {}, { abortEarly: false }), userController.createUser);

// router.post("/admin", superAdminAuth, userController.createAdmin);

router.get("/", adminAuth, userController.getAllUsers);

router.get("/users", adminAuth, userController.getOnlyUsers);

router.get("/admins", superAdminAuth, userController.getAllAdmins);

router.get("/logout", userAuth, userController.logout);

router.get("/:id", userAuth, userController.getUserById);

router.post("/signin", validate(userValidation.userSignInEndpoint, {}, { abortEarly: false }), shouldBeSignedOut, userController.signin);

router.delete("/:id", superAdminAuth, userController.deleteUser);

router.patch("/password", validate(userValidation.changePasswordEndpoint, {}, { abortEarly: false }), userAuth, userController.changePassword);

router.patch("/", adminAuth, userController.updateUser);

module.exports = router;
