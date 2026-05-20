const express = require('express');
const upload = require('../middleware/upload');
const { validateCandidate, handleValidationErrors } = require('../middleware/validation');
const candidateController = require('../controllers/candidateController');

const router = express.Router();

// Submit form with file uploads
router.post(
  '/submit',
  upload.fields([
    { name: 'class10Marksheet', maxCount: 1 },
    { name: 'class12Marksheet', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  validateCandidate,
  handleValidationErrors,
  candidateController.submitForm
);

// Get all candidates
router.get('/', candidateController.getAllCandidates);

// Get statistics
router.get('/stats', candidateController.getStatistics);

// Get candidate by ID
router.get('/:id', candidateController.getCandidateById);

// Update candidate status
router.patch('/:id/status', candidateController.updateCandidateStatus);

// Delete candidate
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;
