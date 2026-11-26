const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate, requireRole } = require('../middleware/auth');

router.post('/', authenticate, applicationController.apply);
router.get('/my', authenticate, applicationController.getMyApplications);
router.get('/opportunity/:opportunityId', authenticate, requireRole('recruiter', 'admin'), applicationController.getOpportunityApplicants);
router.patch('/:id/status', authenticate, requireRole('recruiter', 'admin'), applicationController.updateStatus);

module.exports = router;
