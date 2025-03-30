const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const leadController = require('../controllers/leadController');
const auth = require('../middleware/auth');

// Validation middleware
const leadValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required'),
  body('location.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('serviceType').isIn(['blinds', 'painting', 'both']).withMessage('Invalid service type'),
  body('source').isIn(['google_ads', 'facebook_ads', 'organic_search', 'referral', 'direct'])
    .withMessage('Invalid lead source')
];

// Public routes
router.post('/', leadValidation, leadController.createLead);

// Protected routes
router.get('/', auth, leadController.getLeads);
router.get('/location', auth, leadController.getLeadsByLocation);
router.get('/:id', auth, leadController.getLeadById);
router.put('/:id', auth, leadValidation, leadController.updateLead);
router.delete('/:id', auth, leadController.deleteLead);
router.patch('/:id/status', auth, leadController.updateLeadStatus);
router.patch('/:id/assign', auth, leadController.assignLead);

module.exports = router; 