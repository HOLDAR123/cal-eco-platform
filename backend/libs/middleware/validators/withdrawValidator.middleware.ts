import { check } from 'express-validator';

export const withdrawSchema = [
  check('tokenAmount')
    .not().isEmpty()
    .withMessage('Token field is required.')
    .isFloat({ gt: 99 })
];
