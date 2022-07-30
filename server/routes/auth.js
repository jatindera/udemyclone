import express from 'express';
import { model } from 'mongoose';
import {
    register,
    login,
    logout,
    currentUser,
    sendEmail,
    forgotPassword,
    validateToken,
    resetPassword
} from '../controllers/auth';
import { requireSignin } from '../middlewares';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout)
router.get('/currentUser', requireSignin, currentUser)
router.get('/sendEmail', sendEmail)
router.post('/forgotPassword', forgotPassword)
router.get('/validateToken', validateToken)
router.post('/resetPassword', resetPassword)
module.exports = router;