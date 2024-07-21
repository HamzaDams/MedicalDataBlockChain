import express from 'express';
import { getBlockchain, getBlockByIndex, validateBlockchain } from '../controllers/adminController.js';

const router = express.Router();

router.get('/blockchain', getBlockchain);
router.get('/block/:index', getBlockByIndex);
router.get('/validate', validateBlockchain);

export default router;
