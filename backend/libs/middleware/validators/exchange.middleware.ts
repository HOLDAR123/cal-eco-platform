import { check } from 'express-validator';

export const ticketSchema = [
  check('title')
    .not().isEmpty()
    .withMessage('title is required'),
  check('reason')
    .not().isEmpty()
    .withMessage('reason is required')
];
