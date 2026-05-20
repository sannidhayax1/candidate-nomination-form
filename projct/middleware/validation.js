const { body, validationResult } = require('express-validator');

const validateCandidate = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('personalEmail')
    .trim()
    .notEmpty()
    .withMessage('Personal email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('collegeName')
    .trim()
    .notEmpty()
    .withMessage('College name is required'),
  
  body('branch')
    .trim()
    .notEmpty()
    .withMessage('Branch is required'),
  
  body('enrollmentNumber')
    .trim()
    .notEmpty()
    .withMessage('Enrollment number is required'),
  
  body('yearOfPassing')
    .isInt({ min: 2000, max: new Date().getFullYear() + 10 })
    .withMessage('Please provide a valid year of passing'),
  
  body('contactNumber')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Contact number must be exactly 10 digits'),
  
  body('aadhaarNumber')
    .trim()
    .matches(/^[0-9]{12}$/)
    .withMessage('Aadhaar number must be exactly 12 digits'),
  
  body('class10Percentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Class 10 percentage must be between 0 and 100'),
  
  body('class12Percentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Class 12 percentage must be between 0 and 100'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateCandidate,
  handleValidationErrors,
};
