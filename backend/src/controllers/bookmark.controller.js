const db = require('../db/database');

/**
 * Get all bookmarks for the authenticated user
 * GET /api/bookmarks
 */
exports.getBookmarks = (req, res, next) => {
  try {
    const bookmarks = db.find('bookmarks', (b) => b.userId === req.user.id);

    // Enrich with opportunity details
    const opportunities = bookmarks
      .map((b) => {
        const opp = db.findById('opportunities', b.opportunityId);
        return opp ? { ...opp, bookmarkedAt: b.createdAt } : null;
      })
      .filter(Boolean);

    res.json({
      success: true,
      data: opportunities
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle bookmark for an opportunity (Save / Unsave)
 * POST /api/bookmarks/:opportunityId
 */
exports.toggleBookmark = (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opp = db.findById('opportunities', opportunityId);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const existing = db.findOne(
      'bookmarks',
      (b) => b.userId === req.user.id && b.opportunityId === opportunityId
    );

    if (existing) {
      // Remove bookmark
      db.delete('bookmarks', existing.id);
      return res.json({
        success: true,
        bookmarked: false,
        message: 'Opportunity removed from saved list.'
      });
    } else {
      // Add bookmark
      db.create('bookmarks', {
        userId: req.user.id,
        opportunityId
      });
      return res.json({
        success: true,
        bookmarked: true,
        message: 'Opportunity saved to your bookmarks!'
      });
    }
  } catch (err) {
    next(err);
  }
};
