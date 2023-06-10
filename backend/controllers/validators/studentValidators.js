import * as yup from 'yup';

export const joinWaitingRoomSchema = yup
    .object({
        student_first_name: yup.string().trim().required(),
        student_last_name: yup.string().trim().required(),
        room_code: yup.string().trim().required()
    })
    .required();

export const leaveWaitingRoomSchema = yup
    .object({
        studentID_pk: yup.string().trim().required()
    })
    .required();

export const findStudentSchema = yup
    .object({
        studentID_pk: yup.string().trim().required(),
        room_code_pk: yup.string().trim().required(),
    })
    .required();