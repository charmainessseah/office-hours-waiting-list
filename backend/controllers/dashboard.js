import db from '../dbconfig.js'

export const getAllCreatedWaitingLists = async (req, res) => {
    const { body } = req;
    const user_id = req.app.locals.uid;

    try {
        let sqlQuery = 'SELECT waiting_list_name, room_code_pk, first_name, last_name FROM teaching_assistant INNER JOIN users ON teaching_assistant.user_id = users.user_id WHERE teaching_assistant.user_id=$1 AND time_destroyed IS NULL ORDER BY time_created'

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

export const getAllJoinedWaitingLists = async (req, res) => {
    const { body } = req;
    const user_id = req.app.locals.uid;

    try {
        let sqlQuery = 'SELECT student.studentid_pk, student.room_code_pk, teaching_assistant.waiting_list_name, users.first_name AS ta_first_name, users.last_name AS ta_last_name from student INNER JOIN teaching_assistant ON student.room_code_pk = teaching_assistant.room_code_pk INNER JOIN users ON teaching_assistant.user_id = users.user_id WHERE student.user_id=$1 AND is_waiting=$2'

        db.any(sqlQuery, [user_id, 1])
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