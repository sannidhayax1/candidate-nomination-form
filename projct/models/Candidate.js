const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /.+\@.+\..+/,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    personalEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },
    yearOfPassing: {
      type: Number,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    aadhaarNumber: {
      type: String,
      required: true,
      match: /^[0-9]{12}$/,
      unique: true,
    },
    class10Percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    class10Marksheet: {
      filename: String,
      url: String,
      uploadedAt: Date,
    },
    class12Percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    class12Marksheet: {
      filename: String,
      url: String,
      uploadedAt: Date,
    },
    resume: {
      filename: String,
      url: String,
      uploadedAt: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'shortlisted', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Candidate', candidateSchema);
