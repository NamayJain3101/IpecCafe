import express from 'express'
import { authUser, deleteUser, getUserById, getUserProfile, getUsers, rechargeWallet, registerUser, updateUser, updateUserProfile } from '../Controllers/userController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile)
router.route('/profile').put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)
router.route('/:id/recharge').put(protect, rechargeWallet)

export default router