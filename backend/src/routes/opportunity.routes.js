const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunity.controller');
const { authenticate, optionalAuth, requireRole } = require('../middleware/auth');

router.get('/', opportunityController.getOpportunities);
router.get('/featured', opportunityController.getFeatured);
router.get('/:id', optionalAuth, opportunityController.getOpportunityById);
router.post('/', authenticate, requireRole('recruiter', 'admin'), opportunityController.createOpportunity);
router.put('/:id', authenticate, requireRole('recruiter', 'admin'), opportunityController.updateOpportunity);
router.delete('/:id', authenticate, requireRole('recruiter', 'admin'), opportunityController.deleteOpportunity);

module.exports = router;
