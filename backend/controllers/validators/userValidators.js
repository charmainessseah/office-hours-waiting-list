import * as yup from 'yup';

export const userSignUpSchema = yup
    .object({
        first_name: yup.string().trim().required(),
        last_name: yup.string().trim().required()
    })
    .required();