import db from '../dbconfig.js'
import crypto from 'crypto'
import { createWaitingListSchema, destroyWaitingListSchema } from './validators/waitingListValidator.js'

function generateUniqueWaitingListCode(size = 4) {
    return crypto.randomBytes(size).toString('hex');
}

export const createWaitingList = async (req, res) => {
    const { body } = req;
    const user_id = req.app.locals.uid

    try {
        const data = createWaitingListSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        let waitingListName = data['waiting_list_name']

        let roomCode = generateUniqueWaitingListCode()

        let sqlQuery = 'INSERT INTO teaching_assistant (room_code_pk, time_created, waiting_list_name, user_id) VALUES ($1, $2, $3, $4)';

        db.any(sqlQuery, [roomCode, new Date(), waitingListName, user_id])
            .then(function (data) {
                return res.status(200).json({
                    message: 'successfully created waiting room',
                    data,
                    room_code: roomCode,
                    waiting_list_name: waitingListName
                });
            }
            ).catch(function (error) {
                res.status(400).json({ message: 'failed to create a waiting room' })
                throw error;
            })

    } catch (error) {
        return res.status(422).json({ errors: error.errors });
    }
}

export const getAllStudentsInWaitingList = async (req, res) => {
    const queryParams = req.query
    const user_id = req.app.locals.uid

    try {
        if (!queryParams.roomCode) {
            return res.status(422).json({ errors: 'roomCode query param is required' });
        }
        const roomCode = queryParams.roomCode
        // let sqlQuery = 'SELECT studentID_pk, student_first_name, student_last_name, time_entered FROM student WHERE is_waiting = $1 AND room_code_pk = $2 ORDER BY time_entered;'
        let sqlQuery = 'SELECT studentID_pk, time_entered, first_name, last_name FROM student JOIN users ON student.user_id = users.user_id WHERE is_waiting=$1 AND room_code_pk=$2 ORDER BY time_entered'

        db.any(sqlQuery, [1, roomCode])
            .then(
                function (data) {
                    return res.status(200).json({
                        message: 'successfully retrieved list of students in the waiting room',
                        query_result: data
                    })
                }
            ).catch(
                function (error) {
                    res.status(400).json({ message: 'failed to retrieve list of students in the waiting room' })
                    throw error;
                }
            )
    } catch (error) {
        return res.status(422).json({ errors: error.errors });
    }

}

export const destroyWaitingList = async (req, res) => {
    const { body } = req;
    try {
        const data = destroyWaitingListSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        let roomCode = data['room_code_pk']

        let sqlQuery = 'UPDATE teaching_assistant SET time_destroyed = $1 WHERE room_code_pk = $2';
        db.any(sqlQuery, [new Date(), roomCode])
            .then(
                function (data) {
                    return res.status(200).json({
                        message: 'successfully deleted waiting room',
                        data
                    });
                }
            ).catch(
                function (error) {
                    res.status(400).json({ message: 'failed to delete a waiting room' })
                    throw error;
                }
            )
    }
    catch {
        return res.status(422).json({ errors: error.errors });
    }
}