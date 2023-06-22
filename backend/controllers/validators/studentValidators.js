import * as yup from 'yup';

export const joinWaitingListSchema = yup
    .object({
        room_code: yup.string().trim().required()
    })
    .required();

export const leaveWaitingListSchema = yup
    .object({
        studentID_pk: yup.string().trim().required()
    })
    .required();