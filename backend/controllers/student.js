import db from '../dbconfig.js'
import { joinWaitingRoomSchema, leaveWaitingRoomSchema, findStudentSchema } from './validators/studentValidators.js'

/* PARAMS: The room code of list student is trying to join and student name.
   This function creates a SQL insert statement that adds the student to 
   the wait list.
    */
export const joinWaitingRoom = async (req, res) => {
    const { body } = req;
    const user_id = req.app.locals.uid

    try {
        const data = joinWaitingRoomSchema.validateSync(body, { abortEarly: false, stripUnknown: true });

        let studentFirstName = data['student_first_name']
        let studentLastName = data['student_last_name']
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
                sqlQuery = 'INSERT INTO student (student_first_name, student_last_name, time_entered, time_left, room_code_pk, is_waiting, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING studentid_pk;'
                let studentId = await db.any(sqlQuery, [studentFirstName, studentLastName, new Date(), null, roomCode, 1, user_id])
                    .catch(function (error) {
                        res.status(400).json({ message: 'failed to join a waiting list' })
                        throw error;
                    })

                sqlQuery = 'SELECT waiting_room_name, teaching_assistant_first_name, teaching_assistant_last_name FROM teaching_assistant WHERE room_code_pk =$1'
                const result = await db.any(sqlQuery, [roomCode])

                return res.json({ message: 'successfully joined the waiting list', last_inserted_id: studentId, query_result: result[0] })
            }
        } else {
            console.log('List does not exist!');
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
export const leaveWaitingRoom = async (req, res) => {
    const { body } = req;

    try {
        const data = leaveWaitingRoomSchema.validateSync(body, { abortEarly: false, stripUnknown: true });

        let id = data['studentID_pk']
        console.log('data', data)

        // first check that this person is on the waiting list
        let sqlQuery = 'SELECT * FROM student WHERE studentID_pk=$1 AND is_waiting = $2'
        let result = await db.any(sqlQuery, [id, 1])

        console.log('result len: ', result.length)

        if (result && result.length) {
            sqlQuery = 'UPDATE student SET time_left=$1, is_waiting=$2 WHERE studentid_pk=$3'
            db.any(sqlQuery, [new Date(), 0, id])
                .then(function (data) {
                    return res.json({
                        message: 'Successfully removed student from the waiting list.'
                    });
                })
                .catch(function (error) {
                    return res.status(404).json({ message: "Error trying to remove student from the waiting list" });;
                })
        } else {
            return res.status(403).json({ message: "Student was not found in the list!" });;
        }
    } catch (error) {
        console.log('ther was an error trying to remove student')
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
        console.log('encountered error student find')
        return res.status(422).json({ errors: error.errors });
    }
}
