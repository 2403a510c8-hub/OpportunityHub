const db = require('../db/database');

/**
 * Get all opportunities with flexible search & filtering
 * GET /api/opportunities
 */
exports.getOpportunities = (req, res, next) => {
  try {
    const {
      search = '',
      type,
      category,
      workMode,
      sortBy = 'newest',
      page = 1,
      limit = 20,
      featured
    } = req.query;

    let items = db.getCollection('opportunities');

    // 1. Status Filter: only show Active unless recruiter queries own
    items = items.filter((opp) => opp.status !== 'Closed');

    // 2. Keyword Search (title, organization, description, tags)
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      items = items.filter((opp) => {
        return (
          opp.title.toLowerCase().includes(q) ||
          opp.organization.toLowerCase().includes(q) ||
          (opp.description && opp.description.toLowerCase().includes(q)) ||
          (opp.tags && opp.tags.some((tag) => tag.toLowerCase().includes(q)))
        );
      });
    }

    // 3. Type Filter
    if (type && type !== 'All') {
      items = items.filter((opp) => opp.type.toLowerCase() === type.toLowerCase());
    }

    // 4. Category Filter
    if (category && category !== 'All') {
      items = items.filter((opp) => opp.category.toLowerCase() === category.toLowerCase());
    }

    // 5. WorkMode Filter
    if (workMode && workMode !== 'All') {
      items = items.filter((opp) => opp.workMode.toLowerCase() === workMode.toLowerCase());
    }

    // 6. Featured only
    if (featured === 'true') {
      items = items.filter((opp) => opp.featured === true);
    }

    // 7. Sorting
    if (sortBy === 'deadline') {
      items.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === 'popular') {
      items.sort((a, b) => (b.applicantsCount || 0) - (a.applicantsCount || 0));
    } else {
      // default: newest
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // 8. Pagination
    const total = items.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = items.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginatedItems,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Featured Opportunities (for Landing Page Carousel)
 * GET /api/opportunities/featured
 */
exports.getFeatured = (req, res, next) => {
  try {
    const items = db.find('opportunities', (opp) => opp.featured === true || (opp.applicantsCount || 0) > 40);
    res.json({
      success: true,
      data: items.slice(0, 6)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Opportunity by ID
 * GET /api/opportunities/:id
 */
exports.getOpportunityById = (req, res, next) => {
  try {
    const opp = db.findById('opportunities', req.params.id);
    if (!opp) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if current user has already applied or bookmarked (if token supplied)
    let userHasApplied = false;
    let userHasBookmarked = false;

    if (req.user) {
      const application = db.findOne('applications', (a) => a.opportunityId === opp.id && a.applicantId === req.user.id);
      if (application) userHasApplied = true;

      const bookmark = db.findOne('bookmarks', (b) => b.opportunityId === opp.id && b.userId === req.user.id);
      if (bookmark) userHasBookmarked = true;
    }

    // Fetch related opportunities in the same category
    const related = db
      .find('opportunities', (o) => o.category === opp.category && o.id !== opp.id)
      .slice(0, 3);

    res.json({
      success: true,
      data: {
        ...opp,
        userHasApplied,
        userHasBookmarked,
        related
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new Opportunity (Recruiter/Admin only)
 * POST /api/opportunities
 */
exports.createOpportunity = (req, res, next) => {
  try {
    const {
      title,
      organization,
      logo,
      type = 'Internship',
      category = 'Engineering',
      workMode = 'Remote',
      location = 'Remote',
      experienceLevel = 'All Levels Welcome',
      salaryOrStipend,
      deadline,
      description,
      requirements = [],
      responsibilities = [],
      benefits = [],
      tags = [],
      applyUrl,
      contactEmail
    } = req.body;

    if (!title || !organization || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, organization, description, and deadline are required fields.'
      });
    }

    const newOpp = db.create('opportunities', {
      title,
      organization,
      logo: logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(organization)}`,
      type,
      category,
      workMode,
      location,
      experienceLevel,
      salaryOrStipend: salaryOrStipend || 'Competitive',
      deadline,
      featured: false,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities],
      benefits: Array.isArray(benefits) ? benefits : [benefits],
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      applyUrl: applyUrl || '',
      contactEmail: contactEmail || req.user.email,
      postedBy: req.user.id,
      status: 'Active',
      applicantsCount: 0
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity successfully posted!',
      data: newOpp
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update an Opportunity
 * PUT /api/opportunities/:id
 */
exports.updateOpportunity = (req, res, next) => {
  try {
    const opp = db.findById('opportunities', req.params.id);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Only creator or admin can update
    if (opp.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing.' });
    }

    const updated = db.update('opportunities', req.params.id, req.body);
    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete an Opportunity
 * DELETE /api/opportunities/:id
 */
exports.deleteOpportunity = (req, res, next) => {
  try {
    const opp = db.findById('opportunities', req.params.id);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    if (opp.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing.' });
    }

    db.delete('opportunities', req.params.id);
    res.json({
      success: true,
      message: 'Opportunity removed successfully'
    });
  } catch (err) {
    next(err);
  }
};
