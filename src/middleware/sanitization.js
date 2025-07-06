const { body, param, query } = require('express-validator');

// Sanitize task inputs
const sanitizeTaskInput = [
  body('title').trim().escape(),
  body('description').trim().escape(),
  body('priority').trim().toUpperCase(),
  param('id').isInt().toInt(),
];

// Sanitize category inputs
const sanitizeCategoryInput = [
  body('name').trim().escape(),
  body('color').trim(),
];

// Sanitize user inputs
const sanitizeUserInput = [
  body('firstName').optional().trim().escape(),
  body('lastName').optional().trim().escape(),
  body('username').trim().toLowerCase(),
  body('email').trim().toLowerCase().normalizeEmail(),
];

// Sanitize query parameters
const sanitizeTaskQuery = [
  query('search').optional().trim().escape(),
  query('priority').optional().trim().toUpperCase(),
  query('completed').optional().isBoolean().toBoolean(),
  query('category').optional().isInt().toInt(),
  query('sortBy').optional().trim(),
  query('order').optional().trim().toLowerCase(),
];

module.exports = {
  sanitizeTaskInput,
  sanitizeCategoryInput,
  sanitizeUserInput,
  sanitizeTaskQuery
};