import express from 'express';
import { UserRegister,loginUser ,otpvalidate,updatePassword,updateUser} from "../controller/user.controller.js";
const router = express.Router();
router.post('/register', UserRegister);
router.post('/login', loginUser);
router.post('/otp', otpvalidate);
router.put("/password-update",updatePassword);
router.put("/update-user/:id",updateUser)
export default router;

