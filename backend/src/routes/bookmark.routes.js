const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmark.controller');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, bookmarkController.getBookmarks);
router.post('/:opportunityId', authenticate, bookmarkController.toggleBookmark);

module.exports = router;
