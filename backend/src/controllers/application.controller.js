const db = require('../db/database');

/**
 * Submit an application
 * POST /api/applications
 */
exports.apply = (req, res, next) => {
  try {
    const { opportunityId, coverNote, resumeUrl, portfolioUrl, answers = {} } = req.body;

    if (!opportunityId) {
      return res.status(400).json({
        success: false,
        message: 'Opportunity ID is required.'
      });
    }

    const opp = db.findById('opportunities', opportunityId);
    if (!opp) {
      return res.status(404).json({
        success: false,
        message: 'Target opportunity does not exist.'
      });
    }

    if (opp.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is closed for submissions.'
      });
    }

    // Check if user already submitted an application
    const existing = db.findOne(
      'applications',
      (a) => a.opportunityId === opportunityId && a.applicantId === req.user.id
    );

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an application for this opportunity.'
      });
    }

    // Create the application
    const application = db.create('applications', {
      opportunityId,
      applicantId: req.user.id,
      applicantName: req.user.name,
      applicantEmail: req.user.email,
      applicantPhone: req.body.applicantPhone || '',
      resumeUrl: resumeUrl || req.user.resumeUrl || '',
      portfolioUrl: portfolioUrl || req.user.portfolio || '',
      coverNote: coverNote || '',
      answers,
      status: 'Submitted',
      appliedAt: new Date().toISOString()
    });

    // Increment applicant count on opportunity
    db.update('opportunities', opportunityId, {
      applicantsCount: (opp.applicantsCount || 0) + 1
    });

    // Create notification for applicant
    db.create('notifications', {
      userId: req.user.id,
      title: 'Application Submitted',
      message: `Your application for "${opp.title}" at ${opp.organization} has been received.`,
      type: 'application_submitted',
      read: false
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user's submitted applications
 * GET /api/applications/my
 */
exports.getMyApplications = (req, res, next) => {
  try {
    const applications = db.find('applications', (a) => a.applicantId === req.user.id);

    // Enrich applications with opportunity details
    const enriched = applications.map((app) => {
      const opp = db.findById('opportunities', app.opportunityId);
      return {
        ...app,
        opportunity: opp || {
          title: 'Opportunity (Archived)',
          organization: 'Unknown',
          type: 'General',
          logo: ''
        }
      };
    });

    res.json({
      success: true,
      data: enriched
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all applications for a specific opportunity (Recruiter portal)
 * GET /api/applications/opportunity/:opportunityId
 */
exports.getOpportunityApplicants = (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const opp = db.findById('opportunities', opportunityId);

    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Only creator or admin can view applicants
    if (opp.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view applicants for this posting.'
      });
    }

    const applicants = db.find('applications', (a) => a.opportunityId === opportunityId);

    // Enrich with applicant user profile details if available
    const enriched = applicants.map((app) => {
      const user = db.findById('users', app.applicantId);
      return {
        ...app,
        applicantProfile: user
          ? {
              headline: user.headline,
              skills: user.skills,
              education: user.education,
              avatar: user.avatar,
              github: user.github,
              linkedin: user.linkedin
            }
          : null
      };
    });

    res.json({
      success: true,
      opportunity: opp,
      data: enriched
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update application status (Recruiter only)
 * PATCH /api/applications/:id/status
 */
exports.updateStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Submitted', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = db.findById('applications', id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const opp = db.findById('opportunities', application.opportunityId);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Associated opportunity not found.' });
    }

    if (opp.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update candidate statuses for this opportunity.'
      });
    }

    const updated = db.update('applications', id, { status });

    // Notify the applicant of the update
    db.create('notifications', {
      userId: application.applicantId,
      title: 'Application Status Update',
      message: `Your application status for "${opp.title}" has been updated to "${status}".`,
      type: 'status_change',
      read: false
    });

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
