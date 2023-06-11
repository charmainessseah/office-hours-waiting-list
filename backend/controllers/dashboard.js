import db from '../dbconfig.js'

export const getAllOpenWaitingLists = async (req, res) => {
    const { body } = req;
    const user_id = req.app.locals.uid;

    try {
        let sqlQuery = `SELECT teaching_assistant_first_name, teaching_assistant_last_name, waiting_room_name, room_code_pk FROM teaching_assistant WHERE time_destroyed is NULL AND user_id = $1 ORDER BY time_created;`

        db.any(sqlQuery, [user_id])
            .then(function (data) {
                return res.status(200).json({
                    message: `successfully retrieved all open waiting lists created by user ${user_id}`,
                    query_result: data
                })
            })
            .catch(function (error) {
                res.status(400).json({ message: `failed to retrieve all open waiting lists created by user ${user_id}` })
                throw error;
            })
    } catch (error) {
        res.status(422).json({ errors: error.error })
    }
}

export const getAllJoinedWaitingRooms = async (req, res) => {
    const { body } = req;
    const user_id = req.app.locals.uid;

    try {
        let sqlQuery = `SELECT 
        student.student_first_name, student.student_last_name, student.room_code_pk, student.studentID_pk,
        teaching_assistant.teaching_assistant_first_name, teaching_assistant.teaching_assistant_last_name, teaching_assistant.waiting_room_name
        FROM student 
        INNER JOIN teaching_assistant
        ON student.room_code_pk = teaching_assistant.room_code_pk
        WHERE student.time_left is NULL AND student.user_id = $1 AND teaching_assistant.time_destroyed is NULL
        ORDER BY time_entered`

        db.any(sqlQuery, [user_id])
            .then(function (data) {
                return res.status(200).json({
                    message: `successfully retrieved all joined waiting lists created by user ${user_id}`,
                    query_result: data
                })
            })
            .catch(function (error) {
                res.status(400).json({ message: `failed to retrieve all joined waiting lists created by user ${user_id}` })
                throw error;
            })
    } catch (error) {
        res.status(422).json({ errors: error.error })
    }
}