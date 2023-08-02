const formidable = require('formidable');

const { inventory_history, inventory } = require('../models');

const form = formidable({ multiples: true });

const addInventoryHistoryHandler = (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    inventory_history.create({
      item_id: fields.item_id,
      change_type: fields.change_type,
      quantity: fields.quantity,
      note: fields.note
    }).then((inventory_history) => {
      return res.status(201).json({
        message: 'Inventory history created successfully',
        data: inventory_history
      });
    }).catch((error) => {
      return res.status(400).json({ error: error.message });
    });
  });
};

const getAllInventoryHistoryHandler = (req, res) => {
  inventory_history.findAll({
    include: {
        model: inventory,
        attributes: ['name']
    }
  }).then((inventory_history) => {
    return res.status(200).json({
      message: 'Get all inventory history successfully',
      data: inventory_history
    });
  }).catch((error) => {
    return res.status(400).json({ error: error.message });
  });
};

const getInventoryHistoryByIdHandler = (req, res) => {
  inventory_history.findByPk(req.params.id, {
    include: {
        model: inventory,
        attributes: ['name']
    }
  }).then((inventory_history) => {
    if (!inventory_history) {
      return res.status(404).json({
        message: 'Inventory history not found'
      });
    }

    return res.status(200).json({
      message: 'Get inventory history by id successfully',
      data: inventory_history
    });
  }).catch((error) => {
    return res.status(400).json({ error: error.message });
  });
};

const updateInventoryHistoryHandler = (req, res) => {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    inventory_history.findByPk(req.params.id).then((inventory_history) => {
      if (!inventory_history) {
        return res.status(404).json({
          message: 'Inventory history not found'
        });
      }

      inventory_history.update({
        item_id: fields.item_id,
        change_type: fields.change_type,
        quantity: fields.quantity,
        note: fields.note
      }).then((inventory_history) => {
        return res.status(200).json({
          message: 'Inventory history updated successfully',
          data: inventory_history
        });
      }).catch((error) => {
        return res.status(400).json({ error: error.message });
      });
    });
  });
};

const deleteInventoryHistoryHandler = (req, res) => {
  inventory_history.findByPk(req.params.id).then((inventory_history) => {
    if (!inventory_history) {
      return res.status(404).json({
        message: 'Inventory history not found'
      });
    }

    inventory_history.destroy().then(() => {
      return res.status(200).json({
        message: 'Inventory history deleted successfully'
      });
    }).catch((error) => {
      return res.status(400).json({ error: error.message });
    });
  });
};

module.exports = {
  addInventoryHistoryHandler,
  getAllInventoryHistoryHandler,
  getInventoryHistoryByIdHandler,
  updateInventoryHistoryHandler,
  deleteInventoryHistoryHandler
};
