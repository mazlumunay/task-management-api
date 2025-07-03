const prisma = require('../config/database');

// Get all categories (global)
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    const category = await prisma.category.create({
      data: { name, color }
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Category name must be unique' });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: { name, color }
    });
    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};