const formidable = require('formidable');

const { inventory, category } = require('../models');

const form = formidable({ multiples: true });

const addInventoryHandler = (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    inventory.create({
      name: fields.name,
      category_id: fields.category_id,
      purchase_price: fields.purchase_price,
      selling_price: fields.selling_price,
      qty_stock: fields.qty_stock,
      note: fields.note
    }).then((inventory) => {
      return res.status(201).json({
        message: 'Inventory created successfully',
        data: inventory
      });
    }).catch((error) => {
      return res.status(400).json({ error: error.message });
    });
  });
};

const getAllInventoryHandler = (req, res) => {
  inventory.findAll({
    include: {
      model: category,
      attributes: ['name']
    }
  }).then((inventories) => {
    return res.status(200).json({
      message: 'Get all inventories',
      data: inventories
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const getInventoryByIdHandler = (req, res) => {
  inventory.findByPk(req.params.id, {
    include: {
      model: category,
      attributes: ['name']
    }
  }).then((inventory) => {
    if (!inventory) {
      return res.status(404).json({
        message: 'Inventory not found'
      });
    }

    return res.status(200).json({
      message: 'Get inventory by id',
      data: inventory
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const updateInventoryHandler = (req, res) => {
  inventory.findByPk(req.params.id).then((inventory) => {
    if (!inventory) {
      return res.status(404).json({
        message: 'Inventory not found'
      });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error parsing form data' });
      }
  
      inventory.update({
        name: fields.name,
        category_id: fields.category_id,
        purchase_price: fields.purchase_price,
        selling_price: fields.selling_price,
        qty_stock: fields.qty_stock,
        note: fields.note
      }).then((updatedInventory) => {
        return res.status(200).json({
          message: 'Inventory updated successfully',
          data: updatedInventory
        });
      }).catch((error) => {
        return res.status(400).json({ error: error.message });
      });
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

const deleteInventoryHandler = (req, res) => {
  inventory.findByPk(req.params.id).then((inventory) => {
    if (!inventory) {
      return res.status(404).json({
        message: 'Inventory not found'
      });
    }

    inventory.destroy().then(() => {
      return res.status(200).json({
        message: 'Inventory deleted successfully'
      });
    }).catch((error) => {
      return res.status(500).json({ error: error.message });
    });
  }).catch((error) => {
    return res.status(500).json({ error: error.message });
  });
};

module.exports = {
  addInventoryHandler,
  getAllInventoryHandler,
  getInventoryByIdHandler,
  updateInventoryHandler,
  deleteInventoryHandler
};
