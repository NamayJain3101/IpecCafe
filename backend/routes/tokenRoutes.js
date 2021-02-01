import express from 'express'
import { createToken, getTokenById, getTokens, updateTokenToDisable } from '../Controllers/tokenController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, createToken).get(protect, admin, getTokens)
router.route('/:id').get(protect, getTokenById)
router.route('/:id/disable').put(protect, updateTokenToDisable)

export default router