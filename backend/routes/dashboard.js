import express from 'express'
import { getAllCreatedWaitingLists, getAllJoinedWaitingLists } from '../controllers/dashboard.js';

const router = express.Router();

router.get('/getAllCreatedWaitingLists', getAllCreatedWaitingLists)

router.get('/getAllJoinedWaitingLists', getAllJoinedWaitingLists)

export default router;
