var express = require('express');
var router = express.Router();
const admin = require('./controllers/admin');
const users = require('./controllers/users');
const headersValidators = require('./validators/headersValidators');
const path = require('path');
const multer=require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../assets/images'));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

//authentication
router.post('/signup', headersValidators.nonAuthValidation, upload.single('profileImage'), users.signUpUser);
router.post('/verify-email', headersValidators.nonAuthValidation, users.verifyEmail);
router.post('/login', headersValidators.nonAuthValidation, admin.login);

//user 
router.get('/getUserProfile', headersValidators.adminValidation, users.getUserProfile);
router.post('/updateProfile', headersValidators.adminValidation, upload.single('profileImage'), users.updateProfile);

module.exports = router;