const formidable = require('formidable');

const { category } = require('../models');

const form = formidable({ multiples: true });

// const createCategoryHandler = (req, res) => {
//   form.parse(req, (err, fields, files) => {
//     category.create({
//       name: fields.name,
//     }).then((category) => {
//       return res.status(201).json({
//         message: 'Category created successfully',
//         data: category
//       });
//     }).catch((error) => {
//       return res.status(400).json({ error: error.message });
//     });
//   });
// };

const createCategoryHandler = async (req, res) => {
  try {
    const { fields } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { name } = fields;

    if (!name) {
      return res.status(400).json({
        error: 'Name is required'
      });
    }

    const createdCategory = await category.create({ name });

    return res.status(201).json({
      message: 'Category created successfully',
      data: createdCategory
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// const getAllCategoryHandler = (req, res) => {
//   category.findAll().then((categories) => {
//     return res.status(200).json({
//       message: 'Get all categories',
//       data: categories
//     });
//   }).catch((error) => {
//     return res.status(500).json({ error: error.message });
//   });
// };

const getAllCategoryHandler = async (req, res) => {
  try {
    const categories = await category.findAll();

    return res.status(200).json({
      message: 'Get all categories',
      data: categories
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// const deleteCategoryHandler = (req, res) => {
//   category.findByPk(req.params.id).then((category) => {
//     if (!category) {
//       return res.status(404).json({
//         message: 'Category not found'
//       });
//     }

//     category.destroy().then(() => {
//       return res.status(200).json({
//         message: 'Category deleted successfully',
//       });
//     }).catch((error) => {
//       return res.status(400).json({ error: error.message });
//     });
//   });
// };

const deleteCategoryHandler = async (req, res) => {
  try {
    const foundCategory = await category.findByPk(req.params.id);

    if (!foundCategory) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    await foundCategory.destroy();

    return res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCategoryHandler,
  getAllCategoryHandler,
  deleteCategoryHandler
};
