const Joi = require('joi');

const validateBulkUpdate = (req, res, next) => {
  const schema = Joi.object({
    taskIds: Joi.array().items(Joi.number().integer().positive()).min(1).max(50).required(),
    updates: Joi.object({
      completed: Joi.boolean().optional(),
      priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional(),
      categoryId: Joi.number().integer().positive().allow(null).optional()
    }).min(1).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details[0].message
    });
  }
  next();
};

const validateBulkDelete = (req, res, next) => {
  const schema = Joi.object({
    taskIds: Joi.array().items(Joi.number().integer().positive()).min(1).max(50).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateBulkUpdate,
  validateBulkDelete
};