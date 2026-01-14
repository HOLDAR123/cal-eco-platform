import { check } from 'express-validator';

export const registerUserSchema = [
  check('email')
    .not().isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email'),
  check('password')
    .not().isEmpty()
    .withMessage('Password is required')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters'),
  check('confirm_password')
    .not().isEmpty()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password and confirm password does not match'),
];

export const contactRequestSchema = [
  check('name')
    .not().isEmpty()
    .withMessage('Name is required'),
  check('email')
    .not().isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email'),
  check('phone')
    .not().isEmpty()
    .withMessage('Phone is required'),
  check('subject')
    .not().isEmpty()
    .withMessage('Subject is required'),
  check('message')
    .not().isEmpty()
    .withMessage('Message is required'),
];

export const newsLetterSchema = [
  check('email')
    .not().isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email')
];

export const loginUserSchema = [
  check('email')
    .not().isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email'),
  check('password')
    .not().isEmpty()
    .withMessage('Password is required')
];

export const LoginWithAddressSchema = [
  check('address')
    .not().isEmpty()
    .withMessage('Address is required')
];

export const ForgotPasswordSchema = [
  check('email')
    .not().isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email')
];

export const ResetPasswordSchema = [
  check('password')
    .not().isEmpty()
    .withMessage('Password is required')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters'),
  check('confirm_password')
    .not().isEmpty()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password and confirm password does not match')
];

export const updatePasswordSchema = [
  check('old_password')
    .not().isEmpty()
    .withMessage('Old password is required'),
  check('password')
    .not().isEmpty()
    .withMessage('Password is required')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters'),
  check('confirm_password')
    .not().isEmpty()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Password and confirm password does not match')
];
