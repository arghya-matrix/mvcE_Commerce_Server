const express = require('express');
const router = express.Router();
const {insert, update, getAll, deleteUser} = require('../controllers/user.controller')
const userMiddleware = require('../middleware/user.middleware');
const verifyToken = require('../middleware/verifyToken.middleware')
const uploadImage = require('../middleware/uploadImage.middleware')

router.put("/update",verifyToken.userProfile, update);
router.post("/addImage", verifyToken.userProfile,uploadImage.uploadImage, update)
router.post("/addAddress",verifyToken.userProfile, )
router.get("/getAll",getAll);
router.delete("/deleteUser",deleteUser);

module.exports= router;