import { body } from "express-validator"

// common validations
const commonValidationSchema = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Not a valid e-mail address')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({min: 6})
        .withMessage('Password must be of minimum 6 characters')
]


// validation for user registration
export const RegisterValidator = [
    body('fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required.')
        .isString()
        .withMessage('Full name must be a string.'),
    commonValidationSchema
]


// validation for user authentication
export const LoginValidator = [
    commonValidationSchema
]