const Candidate = require('../models/Candidate');
const fs = require('fs');
const path = require('path');

// Submit candidate form
exports.submitForm = async (req, res) => {
  try {
    const { email, fullName, personalEmail, collegeName, branch, enrollmentNumber, yearOfPassing, contactNumber, aadhaarNumber, class10Percentage, class12Percentage } = req.body;

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({
      $or: [
        { email: email },
        { enrollmentNumber: enrollmentNumber },
        { aadhaarNumber: aadhaarNumber },
      ],
    });

    if (existingCandidate) {
      return res.status(409).json({
        success: false,
        error: 'Candidate with this email, enrollment number, or Aadhaar already exists',
      });
    }

    // Prepare file data
    const fileData = {
      class10Marksheet: {},
      class12Marksheet: {},
      resume: {},
    };

    if (req.files.class10Marksheet) {
      fileData.class10Marksheet = {
        filename: req.files.class10Marksheet[0].filename,
        url: `/uploads/${req.files.class10Marksheet[0].filename}`,
        uploadedAt: new Date(),
      };
    }

    if (req.files.class12Marksheet) {
      fileData.class12Marksheet = {
        filename: req.files.class12Marksheet[0].filename,
        url: `/uploads/${req.files.class12Marksheet[0].filename}`,
        uploadedAt: new Date(),
      };
    }

    if (req.files.resume) {
      fileData.resume = {
        filename: req.files.resume[0].filename,
        url: `/uploads/${req.files.resume[0].filename}`,
        uploadedAt: new Date(),
      };
    }

    // Create new candidate
    const candidate = new Candidate({
      email,
      fullName,
      personalEmail,
      collegeName,
      branch,
      enrollmentNumber,
      yearOfPassing,
      contactNumber,
      aadhaarNumber,
      class10Percentage,
      class10Marksheet: fileData.class10Marksheet,
      class12Percentage,
      class12Marksheet: fileData.class12Marksheet,
      resume: fileData.resume,
      status: 'pending',
    });

    await candidate.save();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      candidate: {
        id: candidate._id,
        email: candidate.email,
        fullName: candidate.fullName,
        status: candidate.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all candidates (admin)
exports.getAllCandidates = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }

    const candidates = await Candidate.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Candidate.countDocuments(query);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }

    res.json({
      success: true,
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update candidate status (admin)
exports.updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'under_review', 'shortlisted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { status, notes: notes || candidate.notes },
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }

    res.json({
      success: true,
      message: 'Candidate status updated',
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: 'Candidate not found',
      });
    }

    // Delete associated files
    const filesToDelete = [
      candidate.class10Marksheet?.filename,
      candidate.class12Marksheet?.filename,
      candidate.resume?.filename,
    ];

    filesToDelete.forEach((filename) => {
      if (filename) {
        const filepath = path.join(process.env.UPLOAD_DIR || './uploads', filename);
        fs.unlink(filepath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
    });

    res.json({
      success: true,
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const statusCounts = await Candidate.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      totalCandidates,
      byStatus: {},
    };

    statusCounts.forEach((item) => {
      stats.byStatus[item._id] = item.count;
    });

    res.json({
      success: true,
      statistics: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
