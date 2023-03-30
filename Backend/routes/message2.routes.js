const express = require("express");
const router = express.Router();
// const multer = require('multer')

// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage, inMemory: true }).single('file')

const {
  allMessages,
  qr,
  send2,
  login,
  createInstance,
  logout,
  getUser,
  deleteInstance,
  allInstance,
  allAutoReply,
  createAutoReply,
  updateAutoReply,
  deleteAutoReply,

  allTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  welcomeTemplate,
  changeInstanceName,

  cancel,

  allReceivedMessages,
  pauseSending,
  startSending,
  allApiMessages
} = require("../controllers/message2.controller");

router.route("/all").post(allMessages);
router.route("/received").post(allReceivedMessages);
router.route("/api").post(allApiMessages);
router.route("/send").post(send2);
router.route("/login").post(login);
// router.route("/check_validity").post(check_validity);

router.route("/create-instance").post(createInstance);
router.route("/qr-instance").post(qr);
router.route("/logout-instance").post(logout);
router.route("/instances").post(allInstance);
router.route("/change-instance-name").post(changeInstanceName);
router.route("/delete-instance").post(deleteInstance);
router.route("/getuser").post(getUser);


router.route("/auto-replies").post(allAutoReply);
router.route("/create-auto-reply").post(createAutoReply);
router.route("/update-auto-reply").post(updateAutoReply);
router.route("/delete-auto-reply").post(deleteAutoReply);

router.route("/templates").post(allTemplate);
router.route("/welcome-template").post(welcomeTemplate);
router.route("/create-template").post(createTemplate);
router.route("/update-template").post(updateTemplate);
router.route("/delete-template").post(deleteTemplate);

router.route("/cancel").post(cancel);
router.route("/start").post(startSending);
router.route("/pause").post(pauseSending);

//router.route("/image-ocr-2").post(upload.single('image'),imageOcr2);

module.exports = router;
