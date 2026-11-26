const db = require('../db/database');

/**
 * Get Platform Analytics and Insights
 * GET /api/stats
 */
exports.getPlatformStats = (req, res, next) => {
  try {
    const opportunities = db.getCollection('opportunities');
    const applications = db.getCollection('applications');
    const users = db.getCollection('users');

    const totalOpportunities = opportunities.length;
    const activeOpportunities = opportunities.filter((o) => o.status === 'Active').length;
    const totalApplications = applications.length;
    const totalUsers = users.length;

    // Breakdown by type
    const byType = {};
    opportunities.forEach((o) => {
      byType[o.type] = (byType[o.type] || 0) + 1;
    });

    // Breakdown by category
    const byCategory = {};
    opportunities.forEach((o) => {
      byCategory[o.category] = (byCategory[o.category] || 0) + 1;
    });

    // Status breakdown of applications
    const applicationStatuses = {};
    applications.forEach((a) => {
      applicationStatuses[a.status] = (applicationStatuses[a.status] || 0) + 1;
    });

    // Upcoming deadlines within 30 days
    const now = new Date();
    const upcomingDeadlines = opportunities
      .filter((o) => new Date(o.deadline) >= now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        metrics: {
          totalOpportunities,
          activeOpportunities,
          totalApplications,
          totalUsers
        },
        byType,
        byCategory,
        applicationStatuses,
        upcomingDeadlines
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get User Notifications
 * GET /api/notifications
 */
exports.getNotifications = (req, res, next) => {
  try {
    const notifs = db
      .find('notifications', (n) => n.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = notifs.filter((n) => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      data: notifs
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
exports.markAsRead = (req, res, next) => {
  try {
    const notif = db.findById('notifications', req.params.id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notif.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updated = db.update('notifications', req.params.id, { read: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark all notifications as read
 * POST /api/notifications/mark-all-read
 */
exports.markAllAsRead = (req, res, next) => {
  try {
    const dbData = db.read();
    if (dbData.notifications) {
      dbData.notifications = dbData.notifications.map((n) =>
        n.userId === req.user.id ? { ...n, read: true } : n
      );
      db.write(dbData);
    }
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
};
