const Joi = require('joi');

// Task creation validation
const validateCreateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).optional().allow(''),
    completed: Joi.boolean().optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional(),
    dueDate: Joi.date().iso().optional(),
    categoryId: Joi.number().integer().positive().optional()
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

// Task update validation
const validateUpdateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).optional().allow(''),
    completed: Joi.boolean().optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional(),
    dueDate: Joi.date().iso().optional().allow(null),
    categoryId: Joi.number().integer().positive().optional().allow(null)
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
  validateCreateTask,
  validateUpdateTask
};