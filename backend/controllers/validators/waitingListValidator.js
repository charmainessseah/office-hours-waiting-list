import * as yup from 'yup';

export const createWaitingListSchema = yup
    .object({
        waiting_list_name: yup.string().trim().required()
    })
    .required();

export const destroyWaitingListSchema = yup
    .object({
        room_code_pk: yup.string().trim().required()
    })
    .required();