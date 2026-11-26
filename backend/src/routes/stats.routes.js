const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', statsController.getPlatformStats);
router.get('/notifications', authenticate, statsController.getNotifications);
router.patch('/notifications/:id/read', authenticate, statsController.markAsRead);
router.post('/notifications/mark-all-read', authenticate, statsController.markAllAsRead);

module.exports = router;
