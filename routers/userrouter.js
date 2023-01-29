const router = require("express").Router();
const signup = require("../componnents/authentications/user/signup");
const login= require("../componnents/authentications/user/login");
const dashboard=require("../componnents/dashboard/user/dashboard");



//--user/signup
router.post('/signup',signup.post);
router.get('/signup',signup.get);
router.get('/signup/verifyotp/:email',signup.verifyotp);
router.post('/signup/verifyotp/:email',signup.checkotp);




//--user/login
router.post('/login',login.post);
router.get('/login',login.get);

//--user/dashboard
router.get('/dashboard/:email',dashboard.get);



module.exports = router;