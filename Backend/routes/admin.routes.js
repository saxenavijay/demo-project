const express = require("express");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

const {
   getOrders,
   getOrderById,
   getinquiry,
   getUserById,
   changeUserStatus,
   changeOrderStatus,
   statistics,
   getUsers,
   downloadInvoice,
   getFeedback,
   addUser,
   updateUser,
   appData,
   saveAppData,
   uploadImage,
   createInstance,
   login,
   allInstance,
   logoutInstance,
   deleteInstance,


   getResellers,
   resellerMembers,
   asssignInstanceToReseller,
   getResellerById,
   makeReseller,
   assignReseller,
   removeReseller,
   updateInstance


} = require("../controllers/admin.controller");

//user

router.route("/sign-in").post(login);

router.route("/users").post(protect,getUsers);
router.route("/user/:id").get(protect,getUserById);
router.route("/user-status").post(protect,changeUserStatus);

router.route("/orders").post(protect,getOrders);
router.route("/orders/:id").get(protect, getOrderById);
router.route("/order-status").post(protect, changeOrderStatus);
router.route("/order-invoice").post(protect, downloadInvoice);


router.route("/inquiry").post(protect,getinquiry);
router.route("/statistics").get(protect, statistics);
router.route("/feedbacks").get(protect,getFeedback);


router.route("/add-user").post(protect,addUser);
router.route("/update-user").post(protect,updateUser);

router.route("/app-data").get(protect,appData);
router.route("/save-app-data").post(protect,saveAppData);
router.route("/upload-image").post(protect,uploadImage);

router.route("/instances").post(protect,allInstance);
router.route("/create-instance").post(protect,createInstance);

router.route("/logout-instance").post(protect,logoutInstance);
router.route("/delete-instance").post(protect,deleteInstance);

router.route("/make-reseller").post(protect,makeReseller);
router.route("/resellers").post(protect,getResellers);
router.route("/reseller/:id").get(protect,getResellerById);
router.route("/reseller-members").post(protect,resellerMembers);
router.route("/assign-reseller").post(protect,assignReseller);
router.route("/remove-reseller").post(protect,assignReseller);

router.route("/assign-instance-to-reseller").post(protect,asssignInstanceToReseller);

router.route("/update-instance").post(protect,updateInstance);


module.exports = router;