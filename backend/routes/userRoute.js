import express from 'express'
import { protect } from '../middlewares/authMiddleware.js';

import
{ 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
} from '../controllers/userController.js';

const userRouter = express.Router()

userRouter
.post('/register' ,registerUser)
.post('/auth' , authUser)
.post('/logout', logoutUser)

.route('/profile')
.get(protect , getUserProfile)
.put(protect , updateUserProfile)





export default userRouter;