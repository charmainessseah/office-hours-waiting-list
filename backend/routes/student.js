import express from 'express'
import { joinWaitingList } from '../controllers/student.js';
import { leaveWaitingList } from '../controllers/student.js';
import { studentFind } from '../controllers/student.js';
const router = express.Router();

/*
    path from root: /student/joinWaitingRoom
*/
router.post('/joinWaitingRoom', joinWaitingList)

/*
    path from root: /student/leaveWaitingRoom
*/
router.post('/leaveWaitingList', leaveWaitingList)

/*
    path from root: /student/studentFind
*/
router.get('/studentFind', studentFind)


export default router;