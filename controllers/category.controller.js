const formidable = require('formidable');

const { category } = require('../models');

const form = formidable({ multiples: true });

const createCategoryHandler = (req, res) => {
  form.parse(req, (err, fields, files) => {
    category.create({
      name: fields.name,
    }).then((category) => {
      return res.status(201).json({
        message: 'Category created successfully',
        data: category
      });
    }).catch((error) => {
      return res.status(400).json({ error: error.message });
    });
  });
};

const getAllCategoryHandler = (req, res) => {
  category.findAll().then((categories) => {
    return res.status(200).json({
      message: 'Get all categories',
      data: categories
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const updateCategoryHandler = (req, res) => {
  category.findByPk(req.params.id).then((category) => {
    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    form.parse(req, (err, fields, files) => {
      category.update({
        name: fields.name,
      }).then((category) => {
        return res.status(200).json({
          message: 'Category updated successfully',
          data: category
        });
      }).catch((error) => {
        return res.status(400).json({ error: error.message });
      });
    });
  });
};

const deleteCategoryHandler = (req, res) => {
  category.findByPk(req.params.id).then((category) => {
    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    category.destroy().then(() => {
      return res.status(200).json({
        message: 'Category deleted successfully',
      });
    }).catch((error) => {
      return res.status(400).json({ error: error.message });
    });
  });
};

module.exports = {
  createCategoryHandler,
  getAllCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler
};
