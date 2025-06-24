const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Category routes
router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;