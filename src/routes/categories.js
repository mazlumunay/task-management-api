const express = require('express');
const categoryController = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/categoryValidation');

const router = express.Router();

// Category routes
router.get('/', categoryController.getAllCategories);
router.post('/', validateCategory, categoryController.createCategory);
router.put('/:id', validateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;