const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const userMiddleware = require("../middleware/user.middleware");
const verifyToken = require("../middleware/verifyToken.middleware");
const uploadImage = require("../middleware/uploadImage.middleware");

router.put("/update", verifyToken.userProfile, userController.update);
router.post("/updateImage", [
  verifyToken.userProfile,
  uploadImage.updateUserImage,
]);
router.post(
  "/addAddress",
  [verifyToken.userProfile, userMiddleware.userAddressValidation],
  userController.addAddress
);
router.post("/updateAddress", verifyToken.userProfile, userController.updateAddress);
router.post("/deleteUser",verifyToken.userProfile, userController.deleteAddress)
router.get("/getAll", userController.getAll);
router.delete("/deleteUser", userController.deleteUser);

module.exports = router;
