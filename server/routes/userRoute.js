import express from 'express';
import { isAuth, login, logout, register, uploadProfilePic } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth', authUser , isAuth)
userRouter.get('/logout', authUser , logout)
userRouter.post('/upload-profile-pic',authUser,uploadProfilePic)

export default userRouter;