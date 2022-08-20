// bring in necessary dependecies
const express = require('express');
const router = express.Router();
const {register,login,update,deleteUser} = require('./auth');

//routes for different pages
router.route('/register').post(register);
router.route('/login').post(login)
router.route('/update').put(update)
router.route('/deleteUser').delete(deleteUser)



module.exports = router