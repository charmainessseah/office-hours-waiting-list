import express from 'express'
import { createWaitingList } from '../controllers/waitingList.js';
import { getAllStudentsInWaitingList } from '../controllers/waitingList.js';
import { destroyWaitingList } from '../controllers/waitingList.js';
const router = express.Router();

/*
    path from root: /waitingList/createWaitingList
*/
router.post('/createWaitingList', createWaitingList)

/*
    path from root: /waitingList/getAllStudentsInWaitingList
*/
router.get('/getAllStudentsInWaitingList', getAllStudentsInWaitingList)

/*
    path from root: /waitingList/destroyWaitingList
*/
router.post('/destroyWaitingList', destroyWaitingList)


export default router;