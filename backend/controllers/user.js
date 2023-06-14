import db from '../dbconfig.js'
import { userSignUpSchema } from './validators/userValidators.js';

export const createUser = async (req, res) => {
    const { body } = req;
    const user_id = req.app.locals.uid

    try {
        const data = userSignUpSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        let firstName = data['first_name']
        let lastName = data['last_name']

        let sqlQuery = `INSERT INTO users (user_id, first_name, last_name) VALUES ($1, $2, $3)`

        db.any(sqlQuery, [user_id, firstName, lastName])
            .then(function (data) {
                return res.status(200).json({
                    message: `successfully signed up user ${user_id}`,
                })
            })
            .catch(function (error) {
                res.status(400).json({ message: `failed to signup user ${user_id}` })
                throw error;
            })
    } catch (error) {
        res.status(422).json({ errors: error.error })
    }
}

export const getUser = async (req, res) => {
    const user_id = req.app.locals.uid

    try {
        let sqlQuery = `SELECT * FROM users WHERE user_id=$1`

        db.any(sqlQuery, [user_id])
            .then(function (data) {
                let firstName = data[0]['first_name']
                let lastName = data[0]['last_name']

                return res.status(200).json({
                    message: `successfully retrieved user details ${user_id}`,
                    first_name: firstName,
                    last_name: lastName
                })
            })
            .catch(function (error) {
                res.status(400).json({ message: `failed to retrieve user ${user_id}` })
                throw error;
            })
    } catch (error) {
        res.status(422).json({ errors: error.error })
    }
}

