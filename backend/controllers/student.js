import db from '../dbconfig.js'
import { joinWaitingRoomSchema, leaveWaitingRoomSchema, findStudentSchema } from './validators/studentValidators.js'

/* PARAMS: The room code of list student is trying to join and student name.
   This function creates a SQL insert statement that adds the student to 
   the wait list.
    */
export const joinWaitingRoom = async (req, res) => {
    const { body } = req;

    try {
        const data = joinWaitingRoomSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        
        let studentFirstName = data['student_first_name']
        let studentLastName = data['student_last_name']
        let roomCode = data['room_code']

        db.query(`SELECT * FROM teaching_assistant WHERE room_code_pk= "${roomCode}"`, function(err, row) {
            if (err) {
                res.status(400).json({ message: 'Room doesn\'t exist!' })
                throw err;
            }
            else {
                db.query(`INSERT INTO student (student_first_name, student_last_name, time_entered, time_left, room_code_pk, is_waiting) VALUES ('${studentFirstName}', '${studentLastName}', now(), null, '${roomCode}', 1);`, function (err, result, fields) {
                    if (err) {
                        res.status(400).json({ message: 'failed to join a waiting room' })
                        throw err;
                    }
                    console.log(result);
                })

                db.query(`SELECT LAST_INSERT_ID();`, function (err, result, fields) {
                    if (err) {
                        res.status(400).json({ message: 'failed to join a waiting room' })
                        throw err;
                    }
                    console.log(result);
                })

                return res.json({
                    message: "result",
                    data,
                    room_code: roomCode
                });
            }
        });
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

        // Searches db to see if student is in the waiting list 
       db.query(`SELECT * FROM student WHERE studentID_pk= ${id} AND is_waiting = 1`, function(err, row) {

            // If student exists in database, remove from wait list
            if (err) {
                res.status(400).json({ message: 'Student doesn\'t exist!' })
                throw err;
            }
            else {
                if (row && row.length ) {
                    db.query(`UPDATE student SET time_left = now(), is_waiting = 0 WHERE studentID_pk = ${id}`, function (err, result, fields) {
                        if (err) throw err;
                        console.log('Successfully removed from wait list.');
                    })
                } else {
                    console.log('Student was not found in list!');
                }
            }

        });

    } catch (error) {
        return res.status(422).json({ errors: error.errors });
    }
}


/* PARAMS: The id of the student the user is looking for and the roomcode that the student is in
    */
export const studentFind = async(req, res) =>{
    const { body } = req;
    
    try{
        const data = findStudentSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
        let id = data['studentID_pk']
        let roomCode = data['room_code_pk']
        let sqlQuery = `SELECT studentID_pk FROM student WHERE room_code_pk = "${roomCode}" AND is_waiting = 1 ORDER BY time_entered ASC`;
    
        // return a json and go through it to find matching student ID
        db.query(sqlQuery, function(error,result,fields){
            // throws error if something goes wrong
            if(error){
                res.status(400).json({ message: 'Student doesn\'t exist!' })
                throw error;
            }
            // prints result of the query
            else{
                var count = 0;
               for(var i = 0; i < result.length; i++) {
                if(result[i].studentID_pk == id){
                    count++;
                    break;
                }
                else{
                    count++;
                }

               }
               
            return res.json({
                message: result,
                data,
                count
            });
        }

        });
}
catch (error) {
    return res.status(422).json({ errors: error.errors });
}

    }

