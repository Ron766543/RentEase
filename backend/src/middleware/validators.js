import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.'),
  body('role').optional().isIn(['customer', 'vendor']).withMessage('Invalid role.'),
  body('phone').optional().trim().isLength({ max: 15 }),
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];
