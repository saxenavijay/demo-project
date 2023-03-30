const express = require('express')
const controller = require('../controllers/group.controller')
const keyVerify = require('../middleware/keyCheck')
const loginVerify = require('../middleware/loginCheck')

const router = express.Router()

router.route('/create').post(keyVerify, loginVerify, controller.create)
// note: these 2 function might not work for now because
//       i have'nt implement a data store yet.
router.route('/listall').get(keyVerify, loginVerify, controller.listAll)
router.route('/leave').get(keyVerify, loginVerify, controller.leaveGroup)

router
    .route('/inviteuser')
    .post(keyVerify, loginVerify, controller.addNewParticipant)
router.route('/makeadmin').post(keyVerify, loginVerify, controller.makeAdmin)
router
    .route('/demoteadmin')
    .post(keyVerify, loginVerify, controller.demoteAdmin)
router
    .route('/getinvitecode')
    .get(keyVerify, loginVerify, controller.getInviteCodeGroup)

module.exports = router
