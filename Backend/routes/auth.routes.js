const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

// Controllers
const {
  testSignIn,
  login,
  signUp,
  createInstance,
  //updateProfile,
  profile,
  saveFcmToken,
  setProfile,
  generateKey,
  forgotPassword,
  resetPassword,

  statistics

} = require("../controllers/auth.controller");

router.route("/statistics").get(statistics);
router.route("/login").post(login);
router.route("/test-login").post(testSignIn);
router.route("/sign-up").post(signUp);
router.route("/create-instance").post(createInstance);
router.route("/profile").post(profile);
router.route("/profile").get(profile);
router.route("/save-fcm-token").post( saveFcmToken);
router.route("/set-profile").post( setProfile);
router.route("/generate-api-key").post( generateKey);


router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);


module.exports = router;
