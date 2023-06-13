import express from 'express'
import { getAllOpenWaitingLists, getAllJoinedWaitingLists } from '../controllers/dashboard.js';

const router = express.Router();

router.get('/get-all-open-waiting-lists', getAllOpenWaitingLists)

router.get('/getAllJoinedWaitingLists', getAllJoinedWaitingLists)

export default router;
