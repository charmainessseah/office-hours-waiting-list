import db from '../dbconfig.js'
import { joinWaitingListSchema, leaveWaitingListSchema } from './validators/studentValidators.js'

/* PARAMS: The room code of list student is trying to join and student name.
   This function creates a SQL insert statement that adds the student to 
   the wait list.
    */
export const joinWaitingList = async (req, res) => {
    const { body } = req;
    const user_id = req.app.locals.uid

    try {
        const data = joinWaitingListSchema.validateSync(body, { abortEarly: false, stripUnknown: true });

        let roomCode = data['room_code']

        // first check that this waiting list exists
        let sqlQuery = 'SELECT * FROM teaching_assistant WHERE room_code_pk=$1';
        let result = await db.any(sqlQuery, [roomCode]);
        const roomExists = result.length === 0 ? 0 : 1;

        if (roomExists) {
            // check that this user has not already joined the list
            sqlQuery = 'SELECT * FROM student WHERE room_code_pk=$1 AND user_id=$2 AND is_waiting=$3'
            result = await db.any(sqlQuery, [roomCode, user_id, 1])
            const userHasJoinedList = result.length === 0 ? 0 : 1;

            if (userHasJoinedList) {
                return res.status(403).json({ message: "user has already joined this waiting list." })
            } else {
                sqlQuery = 'INSERT INTO student (time_entered, time_left, room_code_pk, is_waiting, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING studentid_pk;'
                let studentId = await db.any(sqlQuery, [new Date(), null, roomCode, 1, user_id])
                    .catch(function (error) {
                        console.log('error')
                        return res.status(400).json({ message: 'failed to join a waiting list' })
                    })
                studentId = studentId[0]['studentid_pk']

                sqlQuery = 'SELECT waiting_list_name, first_name, last_name FROM teaching_assistant INNER JOIN users ON teaching_assistant.user_id = users.user_id WHERE room_code_pk =$1'
                const result = await db.any(sqlQuery, [roomCode])

                return res.json({
                    message: 'successfully joined the waiting list',
                    last_inserted_id: studentId,
                    waiting_list_name: result[0]['waiting_list_name'],
                    first_name: result[0]['first_name'],
                    last_name: result[0]['last_name']
                })
            }
        } else {
            return res.status(404).json({ message: "This waiting list does not exist" });
        }
    } catch (error) {
        return res.status(422).json({ errors: error.errors });
    }
}

/* PARAMS: The id of the student leaving the table.
   This function creates a SQL UPDATE statement that removes the student from 
   the wait list.
    */
export const leaveWaitingList = async (req, res) => {
    const { body } = req;

    try {
        const data = leaveWaitingListSchema.validateSync(body, { abortEarly: false, stripUnknown: true });

        let id = data['studentID_pk']

        // first check that this person is on the waiting list
        let sqlQuery = 'SELECT * FROM student WHERE studentID_pk=$1 AND is_waiting=$2'
        let result = await db.any(sqlQuery, [id, 1])

        if (result && result.length) {
            console.log('inside if')
            sqlQuery = 'UPDATE student SET time_left=$1, is_waiting=$2 WHERE studentid_pk=$3'
            db.any(sqlQuery, [new Date(), 0, id])
                .then(function (data) {
                    return res.status(200).json({
                        message: 'Successfully removed student from the waiting list.'
                    });
                })
                .catch(function (error) {
                    return res.status(404).json({ message: "Error trying to remove student from the waiting list" });;
                })
        } else {
            console.log('inside else')
            return res.status(403).json({ message: "Student was not found in the list!" });;
        }
    } catch (error) {
        return res.status(422).json({ errors: error.errors });
    }
}

/* Function to find the position of a student currently in a waitlist
     * @return  The current position of the student in the waiting list
     */
export const studentFind = async (req, res) => {
    try {
        let studentId = Number(req.query.studentId)
        let roomCode = req.query.roomCode

        let sqlQuery = 'SELECT studentid_pk FROM student WHERE room_code_pk=$1 AND is_waiting=$2 ORDER BY time_entered ASC';

        const result = await db.any(sqlQuery, [roomCode, 1])
        const positionInList = result.findIndex(student => student['studentid_pk'] === studentId) + 1;

        return res.status(200).json({ message: positionInList })
    }
    catch (error) {
        return res.status(422).json({ errors: error.errors });
    }
}
