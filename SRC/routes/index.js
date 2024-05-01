import express from "express";
import authroute from '../routes/auth/authRoute.js'
import userRoute from '../routes/User/userroute.js'
const router = express.Router()

router.use('/auth', authroute)
router.use('/user', userRoute)

export default router;