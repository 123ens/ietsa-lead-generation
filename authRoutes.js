const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Validation middleware
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'sales_rep'])
    .withMessage('Invalid role'),
  body('serviceArea.coordinates')
    .isArray()
    .withMessage('Service area coordinates must be an array')
    .custom((value) => {
      if (value.length !== 2) {
        throw new Error('Service area coordinates must be [longitude, latitude]');
      }
      return true;
    })
];

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('serviceArea.coordinates')
    .optional()
    .isArray()
    .withMessage('Service area coordinates must be an array')
    .custom((value) => {
      if (value.length !== 2) {
        throw new Error('Service area coordinates must be [longitude, latitude]');
      }
      return true;
    })
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.put('/profile', auth, updateProfileValidation, authController.updateProfile);
router.put('/change-password', auth, changePasswordValidation, authController.changePassword);

// Admin routes
router.get('/users', auth, checkRole('admin'), authController.getAllUsers);
router.put('/users/:id/role', auth, checkRole('admin'), authController.updateUserRole);
router.put('/users/:id/status', auth, checkRole('admin'), authController.toggleUserStatus);

module.exports = router; 